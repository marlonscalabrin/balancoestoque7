Estoque = function() {
	this.id = "";
	this.codigo = "";
	this.rua = "";
	this.prateleira = "";
	this.gaveta = "";
	this.quantidade = "";
	this.dados = [];
	
	this.initDatabase = function() {
		try {
			if (!window.openDatabase) {
				alert('Este navegador não suporta banco de dados.\nAbra com uma versão recente do navegador Chrome.');
			} else {
				var shortName = 'estoque';
				var version = '1.0';
				var displayName = 'Estoque';
				var maxSize = 100000; //  bytes
				this.db = openDatabase(shortName, version, displayName, maxSize);
				this.createTables();
				this.selectAll();
			}
		} catch(e) {
			if (e == 2) {
				console.log("Invalid database version.");
			} else {
				console.log("Unknown error "+e+".");
			}
			return;
		}
	}
	
	this.createTables = function() {
		this.db.transaction(
			function (transaction) {
				transaction.executeSql('CREATE TABLE IF NOT EXISTS ' +
					'estoque(' +
					' id INTEGER NOT NULL PRIMARY KEY,' +
					' codigo TEXT NOT NULL,' +
					' rua TEXT NOT NULL,' +
					' prateleira TEXT NOT NULL,' +
					' gaveta TEXT NOT NULL,' +
					' quantidade INTEGER NOT NULL' +
					');', [], function(transaction, data) {
						console.log(transaction, data);
					}, function(error) {
						console.error(error);
					});
			}
		);
	}
		
	this.insert = function(data){
		this.db.transaction(
			function (transaction) {
				var params = [data.codigo, data.rua, data.prateleira, data.gaveta, data.quantidade];
				transaction.executeSql("INSERT INTO estoque(codigo, rua, prateleira, gaveta, quantidade)" +
					" VALUES (?, ?, ?, ?, ?)", params,
					function(transaction, results){
						console.log(transaction, results);
						data.id = results.insertId;
					}, function(transaction, error) {
						console.log("Data: " + data);
						console.error(transaction, error);
					});
			}
		);
	}
		
	this.update = function(data){
		this.db.transaction(
			function (transaction) {
				var params = [data.codigo, data.rua, data.prateleira, data.gaveta, data.quantidade, data.id];
				transaction.executeSql("UPDATE estoque set codigo = ?, rua = ?, prateleira = ?, gaveta = ?, quantidade = ?" +
					" where id = ?", params,
					function(transaction, results) {
						console.log(transaction, results);
					}, function(transaction, error) {
						console.log("Data: " + data);
						console.error(transaction, error);
					});
			}
		);
	}
		
	this.delete = function(data){
		this.db.transaction(
			function (transaction) {
				var params = [data.id];
				transaction.executeSql("DELETE from estoque where id = ?", params,
					function(transaction, results) {
						console.log(transaction, results);
					}, function(transaction, error) {
						console.log("Data: " + data);
						console.error(transaction, error);
					});
			}
		);
	}
	
	this.selectAll = function() {
		var self = this;
		this.db.transaction(
			function (transaction) {
				transaction.executeSql("SELECT * FROM estoque",
					[], function(transaction, results) {
						self.preencherDados(transaction, results);
						self.mostrarLista();
					}, function(error) {
						console.error(error);
					});
			}
		);
	}
	
	this.preencherDados = function(transaction, results) {
		this.dados = [];
		console.log('t',transaction);
		console.log('r',results);
		for (var i=0; i<results.rows.length; i++) {
			var row = results.rows[i];
			var data = {};
	 
			data.id = row['id'];
			data.codigo = row['codigo'];
			data.rua = row['rua'];
			data.prateleira = row['prateleira'];
			data.gaveta = row['gaveta'];
			data.quantidade = row['quantidade'];
			
			this.dados.push(data);	 
		}
	}

	this.inicializarCampos = function() {
		if (this.id)
			document.getElementById("id").value = this.id.toString();
		document.getElementById("codigo").value = this.codigo.toString();
		document.getElementById("rua").value = this.rua.toString();
		document.getElementById("prateleira").value = this.prateleira.toString();
		document.getElementById("gaveta").value = this.gaveta.toString();
		document.getElementById("quantidade").value = this.quantidade.toString();
	}
	
	this.corrigeVirgula = function(event) {
		event.target.value = event.target.value.toString().replace(".", ",");
	}
	
	this.salvar = function() {
		if (document.getElementById("id").value != "")
			this.id = parseInt(document.getElementById("id").value);
		else
			this.id = "";
		this.codigo = document.getElementById("codigo").value;
		this.rua = document.getElementById("rua").value;
		this.prateleira = document.getElementById("prateleira").value;
		this.gaveta = document.getElementById("gaveta").value;
		this.quantidade = parseFloat(document.getElementById("quantidade").value.replace(",", "."));
		
		var data;
		if (this.id != null && this.id != "") {
			for (i = 0; i < this.dados.length; i++) {
				if (""+this.dados[i].id == ""+this.id) {
					data = this.dados[i];
					break;
				}
			}
		} else {
			for (i = 0; i < this.dados.length; i++) {
				if (this.dados[i].codigo == this.codigo) {
					data = this.dados[i];
					if (!confirm("Item com o mesmo código já cadastrado:" +
					"\n Rua: " + data.rua +
					"\n Prateleira: " + data.prateleira +
					"\n Gaveta: " + data.gaveta +
					"\n Quantidade: " + data.quantidade + 
					"\nDeseja editar? Cancelar irá duplicar.")) {
						data = null;
					}
					break;
				}
			}
		}
		
		if (data) {
			data["id"] = this.id;
			data["codigo"] = this.codigo;
			data["rua"] = this.rua;
			data["prateleira"] = this.prateleira;
			data["gaveta"] = this.gaveta;
			data["quantidade"] = this.quantidade;
			this.update(data);
		} else {
			data = {
				codigo: this.codigo,
				rua: this.rua,
				prateleira: this.prateleira,
				gaveta: this.gaveta,
				quantidade: this.quantidade
			}
			
			this.insert(data);
			this.dados.push(data);
		}
		setTimeout(function(o){o.mostrarLista()}, 500, this);
		this.novo();
	}

	this.mostrarLista = function() {
		var corpo = document.getElementById("corpoTabela");
		corpo.innerHTML = "";
		var dados = this.dados;
		for (var i = 0; i < dados.length; i++) {
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			td.innerHTML = dados[i].codigo;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML = dados[i].rua;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML = dados[i].prateleira;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML = dados[i].gaveta;
			tr.appendChild(td);
			td = document.createElement("td");
			td.innerHTML = dados[i].quantidade;
			tr.appendChild(td);
			td = document.createElement("td");
			var editar = document.createElement("input");
			var remover = document.createElement("input");
			editar.type = "button";
			remover.type = "button";
			editar.setAttribute("onclick", "estoque.editar("+dados[i].id+"); return false;");
			editar.value = "Editar";
			remover.setAttribute("onclick", "estoque.remover("+dados[i].id+"); return false;");
			remover.value = "Remover";
			td.appendChild(editar);
			td.appendChild(remover);
			tr.appendChild(td);
			corpo.appendChild(tr);
		}
		document.getElementById("tabela").style.display="";
	}
	
	this.novo = function() {
		this.id = "";
		this.codigo = "";
		this.rua = "";
		this.prateleira = "";
		this.gaveta = "";
		this.quantidade = "";
		this.inicializarCampos();
	}
	
	this.editar = function(id) {
		var data;
		for (var i = 0; i < this.dados.length; i++) {
			if (this.dados[i].id == id) {
				data = this.dados[i];
				break;
			}
		}
		if (data) {
			this.id = id;
			this.codigo = data.codigo;
			this.rua = data.rua;
			this.prateleira = data.prateleira;
			this.gaveta = data.gaveta;
			this.quantidade = data.quantidade;
			this.inicializarCampos();
		}
	}
	
	this.remover = function(id) {
		var data;
		for (var i = 0; i < this.dados.length; i++) {
			if (this.dados[i].id == id) {
				data = this.dados[i];
				this.delete(data);
				this.dados.splice(i, 1);
				break;
			}
		}
		this.mostrarLista();
	}
	
	this.exportarCSV = function() {
		var data = '';
		var sep = prompt("Digite o caracter separador. ';' para Excel ou ',' para demais editores de planilha.");
		sep = sep[0];
		data += "id" + sep;
		data += "Código" + sep;
		data += "Rua" + sep;
		data += "Prateleira" + sep;
		data += "Gaveta" + sep;
		data += "Quantidade" + "\r\n";
		for (var i = 0; i < this.dados.length; i++) {
			data += this.dados[i].id + sep;
			data += this.dados[i].codigo + sep;
			data += this.dados[i].rua + sep;
			data += this.dados[i].prateleira + sep;
			data += this.dados[i].gaveta + sep;
			data += this.dados[i].quantidade + "\r\n";
		}
		var link = document.createElement('a');
		link.download = "estoque.csv";
		link.href = 'data:text/csv;base64,' + window.btoa(data);
		link.click();
	}
	
}
estoque = new Estoque();

var options = {
	successTimeout: 1000,
	codeRepetition: false,
	tryVertical: false,
	frameRate: 10,
	width: 320,
	height: 160,
	constraints: {
		video: {
			mandatory: {
				maxWidth: 1900,
				maxHeight: 1080
			},
			optional: [{
				sourceId: true
			}]
		},
		audio: false
	},
	flipVertical: false,
	flipHorizontal: false,
	zoom: 2,
	decoderWorker: 'DecoderWorker.js',
	brightness: 0,
	autoBrightnessValue: false,
	grayScale: false,
	contrast: 0,
	threshold: 0,
	sharpness: [],      // to On declare matrix, example for sharpness ->  [0, -1, 0, -1, 5, -1, 0, -1, 0]
	resultFunction: function(result) {
		/*
			result.format: code format,
			result.code: decoded string,
			result.imgData: decoded image data
		*/
		document.getElementById("codigo").value = result.code;
	},
	cameraSuccess: function(stream) {
		console.log('cameraSuccess');
	},
	canPlayFunction: function() {
		console.log('canPlayFunction');
	},
	getDevicesError: function(error) {
		console.log(error);
	},
	getUserMediaError: function(error) {
		console.log(error);
	},
	cameraError: function(error) {
		console.log(error);
	}
};

var canvas = document.querySelector('canvas');
var decoder = new WebCodeCamJS(canvas);

decoder.init(options);
/*decoder.buildSelectMenu('#camera-select', 'environment|back');
decoder.buildSelectMenu('#camera-select', 'user|front');
decoder.buildSelectMenu('#camera-select', 0);
*/
decoder.play();
