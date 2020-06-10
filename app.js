var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FieldType;
(function (FieldType) {
    FieldType[FieldType["PoleTekstowe"] = 0] = "PoleTekstowe";
    FieldType[FieldType["PoleWielolinijkowe"] = 1] = "PoleWielolinijkowe";
    FieldType[FieldType["Data"] = 2] = "Data";
    FieldType[FieldType["Email"] = 3] = "Email";
    FieldType[FieldType["PoleWyboru"] = 4] = "PoleWyboru";
    FieldType[FieldType["Checkbox"] = 5] = "Checkbox";
})(FieldType || (FieldType = {}));
var FieldLabel = /** @class */ (function () {
    function FieldLabel(pole) {
        this.pole = pole;
    }
    FieldLabel.prototype.render = function () {
        var label = document.createElement('label');
        label.setAttribute('for', this.pole.nazwa);
        label.innerText = this.pole.etykieta;
        return label;
    };
    return FieldLabel;
}());
var InputField = /** @class */ (function () {
    function InputField(nazwa, etykieta, wartosc) {
        this.typ = FieldType.PoleTekstowe;
        this.nazwa = nazwa;
        this.etykieta = etykieta;
        this.wartosc = wartosc;
    }
    InputField.prototype.getValue = function () {
        return (this.typ == FieldType.Checkbox) ? this.pole.checked : this.pole.value;
    };
    InputField.prototype.render = function () {
        switch (this.typ) {
            case FieldType.PoleTekstowe:
                this.pole = document.createElement('input');
                this.pole.type = 'text';
                this.pole.value = this.wartosc;
                break;
            case FieldType.Data:
                this.pole = document.createElement('input');
                this.pole.type = 'date';
                //this.pole.value = this.wartosc;
                break;
            case FieldType.Email:
                this.pole = document.createElement('input');
                this.pole.type = 'email';
                this.pole.value = this.wartosc;
                break;
            case FieldType.Checkbox:
                this.pole = document.createElement('input');
                this.pole.type = 'checkbox';
                this.pole.checked = this.wartosc;
                break;
            case FieldType.PoleWielolinijkowe:
                this.pole = document.createElement('textarea');
                this.pole.value = this.wartosc;
                break;
        }
        this.pole.name = this.nazwa;
        return this.pole;
    };
    return InputField;
}());
var DateField = /** @class */ (function (_super) {
    __extends(DateField, _super);
    function DateField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typ = FieldType.Data;
        return _this;
    }
    return DateField;
}(InputField));
var EmailField = /** @class */ (function (_super) {
    __extends(EmailField, _super);
    function EmailField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typ = FieldType.Email;
        return _this;
    }
    return EmailField;
}(InputField));
var CheckboxField = /** @class */ (function (_super) {
    __extends(CheckboxField, _super);
    function CheckboxField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typ = FieldType.Checkbox;
        return _this;
    }
    return CheckboxField;
}(InputField));
var TextAreaField = /** @class */ (function (_super) {
    __extends(TextAreaField, _super);
    function TextAreaField() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.typ = FieldType.PoleWielolinijkowe;
        return _this;
    }
    return TextAreaField;
}(InputField));
var SelectField = /** @class */ (function (_super) {
    __extends(SelectField, _super);
    function SelectField(nazwa, etykieta, opcje, wartosc) {
        if (wartosc === void 0) { wartosc = ""; }
        var _this = _super.call(this, nazwa, etykieta, wartosc) || this;
        _this.typ = FieldType.PoleWyboru;
        _this.pole = document.createElement("select");
        _this.pole.name = _this.nazwa;
        _this.wartosc = wartosc;
        for (var _i = 0, opcje_1 = opcje; _i < opcje_1.length; _i++) {
            var opcja = opcje_1[_i];
            _this.dodajOpcje(opcja);
        }
        return _this;
    }
    SelectField.prototype.dodajOpcje = function (tekst) {
        var option = document.createElement('option');
        option.text = tekst;
        this.pole.add(option);
    };
    SelectField.prototype.render = function () {
        if (this.wartosc) {
            for (var i = 0; i < this.pole.options.length; i++) {
                if (this.pole.options[i].text == this.wartosc) {
                    this.pole.options.selectedIndex = i;
                    break;
                }
            }
        }
        return this.pole;
    };
    return SelectField;
}(InputField));
var Form = /** @class */ (function () {
    function Form() {
        this.pola = [];
        this.formularz = document.createElement("form");
    }
    Form.prototype.getValue = function () {
        var objekt = {};
        for (var _i = 0, _a = this.pola; _i < _a.length; _i++) {
            var pole = _a[_i];
            objekt[pole.nazwa] = pole.getValue();
        }
        return objekt;
    };
    Form.prototype.render = function () {
        this.formularz.innerHTML = "";
        for (var _i = 0, _a = this.pola; _i < _a.length; _i++) {
            var pole = _a[_i];
            this.formularz.appendChild((new FieldLabel(pole)).render());
            this.formularz.appendChild(pole.render());
        }
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Zapisz';
        button.addEventListener('click', function (self) { return function () { self.save(); }; }(this));
        this.formularz.appendChild(button);
        var button2 = document.createElement('button');
        button2.type = 'button';
        button2.textContent = 'Wstecz';
        button2.addEventListener('click', function () { window.location.href = "index.html"; });
        this.formularz.appendChild(button2);
        return this.formularz;
    };
    Form.prototype.save = function () {
        (new LocStorage).saveDocument(this.getValue());
        window.location.href = "index.html";
    };
    return Form;
}());
var LocStorage = /** @class */ (function () {
    function LocStorage() {
    }
    LocStorage.prototype.saveDocument = function (dokument) {
        var id = 'document-' + Date.now();
        localStorage.setItem(id, JSON.stringify(dokument));
        return this.addDocumentId(id);
    };
    LocStorage.prototype.addDocumentId = function (id) {
        var o = this.getDocuments();
        if (o.indexOf(id) >= 0)
            return id;
        o.push(id);
        localStorage.setItem('documents', JSON.stringify(o));
        return id;
    };
    LocStorage.prototype.loadDocument = function (id) {
        var o = localStorage.getItem(id);
        if (o)
            return JSON.parse(o);
        return null;
    };
    LocStorage.prototype.getDocuments = function () {
        var o = localStorage.getItem('documents');
        if (o)
            return JSON.parse(o);
        return [];
    };
    LocStorage.prototype.removeDocument = function (id) {
        var o = this.getDocuments();
        var i = o.indexOf(id);
        if (i >= 0) {
            o.splice(i, 1);
            localStorage.setItem('documents', JSON.stringify(o));
            localStorage.removeItem(id);
        }
    };
    LocStorage.prototype.saveForm = function (form) {
        var id = 'form-' + Date.now();
        localStorage.setItem(id, JSON.stringify(form));
        return this.addDocumentId(id);
    };
    LocStorage.prototype.loadForm = function (id) {
        var o = localStorage.getItem(id);
        if (o) {
            var obj = JSON.parse(o);
            var form = new Form();
            for (var _i = 0, _a = obj.pola; _i < _a.length; _i++) {
                var pole = _a[_i];
                var p = new InputField(pole.nazwa, pole.etykieta, pole.wartosc);
                p.typ = pole.typ;
                form.pola.push(p);
            }
            return form;
        }
        return null;
    };
    return LocStorage;
}());
var DocumentList = /** @class */ (function () {
    function DocumentList() {
        this.lista = [];
        this.storage = new LocStorage();
        this.getDocumentList();
    }
    DocumentList.prototype.getDocumentList = function () {
        this.lista = this.storage.getDocuments();
    };
    DocumentList.prototype.removeDocument = function (id) {
        this.storage.removeDocument(id);
    };
    DocumentList.prototype.getDocument = function (id) {
        return this.storage.loadDocument(id);
    };
    DocumentList.prototype.render = function () {
        var table = document.createElement("table");
        for (var _i = 0, _a = this.lista; _i < _a.length; _i++) {
            var id = _a[_i];
            var tr = table.insertRow();
            var a = document.createElement('a');
            a.appendChild(document.createTextNode(id));
            if (id.substr(0, 4) == 'form') {
                a.href = 'edit-form.html?id=' + id;
            }
            else {
                a.href = 'edit-document.html?id=' + id;
            }
            // a.addEventListener('click', function(self, id){ return function(){ alert(JSON.stringify(self.storage.loadDocument(id))); }}(this, id));
            tr.insertCell().appendChild(a);
            var usun = document.createElement('button');
            usun.type = 'button';
            usun.textContent = 'Usuń';
            usun.addEventListener('click', function (self, id) {
                return function () {
                    self.removeDocument(id);
                    window.location.reload();
                };
            }(this, id));
            tr.insertCell().appendChild(usun);
        }
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Wstecz';
        button.addEventListener('click', function () { window.location.href = "index.html"; });
        table.appendChild(button);
        return table;
    };
    return DocumentList;
}());
var App = /** @class */ (function () {
    function App(id) {
        this.parent = document.getElementById(id);
    }
    App.prototype.createDocumentForm = function (id) {
        var doc = (new DocumentList).getDocument(id) || {};
        var documentForm = new Form();
        documentForm.pola.push(new InputField("imie", "Imię", doc.imie || ""));
        documentForm.pola.push(new InputField("nazwisko", "Nazwisko", doc.nazwisko || ""));
        documentForm.pola.push(new EmailField("email", "E-mail", doc.email || ""));
        documentForm.pola.push(new SelectField("kierunek", "Kierunek studiów", ["Fizyka", "Matematyka"], doc.kierunek || ""));
        documentForm.pola.push(new CheckboxField("elearning", "Czy preferujesz e-learning?", doc.elearning || false));
        documentForm.pola.push(new TextAreaField("uwagi", "Uwagi", doc.uwagi || ""));
        return documentForm.render();
    };
    App.prototype.editDocument = function () {
        var id = Router.getParam('id');
        if (id)
            this.parent.appendChild(this.createDocumentForm(id));
    };
    App.prototype.documentList = function () {
        this.parent.appendChild(new DocumentList().render());
    };
    App.prototype.newDocument = function () {
        this.parent.appendChild(this.createDocumentForm());
    };
    App.prototype.formCreator = function () {
        var fc = new FormCreator();
        var id = Router.getParam('id');
        if (id) {
            this.parent.appendChild(fc.editForm(id));
            return;
        }
        this.parent.appendChild(fc.newForm());
    };
    return App;
}());
var Router = /** @class */ (function () {
    function Router() {
    }
    Router.getParam = function (key) {
        var query = window.location.search.substr(1);
        var urlParams = new URLSearchParams(query);
        return urlParams.get(key);
    };
    return Router;
}());
var FormCreator = /** @class */ (function () {
    function FormCreator() {
        this.pola = [];
        this.form = document.createElement("form");
        this.div = document.createElement("div");
        this.content = document.createElement("div");
        this.pola.push(new SelectField("type", "Typ pola", ["Pole tekstowe", "Pole wielolinijkowe", "Checkbox"]));
        this.pola.push(new InputField("name", "Nazwa", ""));
        this.pola.push(new InputField("label", "Etykieta", ""));
        this.pola.push(new InputField("value", "Domyślna wartość", ""));
        for (var _i = 0, _a = this.pola; _i < _a.length; _i++) {
            var pole = _a[_i];
            this.form.appendChild((new FieldLabel(pole)).render());
            this.form.appendChild(pole.render());
        }
        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.textContent = 'Dodaj';
        this.button.addEventListener('click', function (self) {
            return function () {
                switch (self.pola[0].getValue()) {
                    case "Pole tekstowe":
                        self.formNew.pola.push(new InputField(self.pola[1].getValue(), self.pola[2].getValue(), self.pola[3].getValue()));
                        break;
                    case "Pole wielolinijkowe":
                        self.formNew.pola.push(new TextAreaField(self.pola[1].getValue(), self.pola[2].getValue(), self.pola[3].getValue()));
                        break;
                    case "Checkbox":
                        self.formNew.pola.push(new CheckboxField(self.pola[1].getValue(), self.pola[2].getValue(), self.pola[3].getValue()));
                        break;
                }
                self.div.innerHTML = "";
                self.div.appendChild(self.formNew.render());
            };
        }(this));
        this.form.appendChild(this.button);
        var button1 = document.createElement('button');
        button1.type = 'button';
        button1.textContent = 'Zapisz';
        button1.addEventListener('click', function (self) { return function () { self.saveForm(); }; }(this));
        this.form.appendChild(button1);
        var button2 = document.createElement('button');
        button2.type = 'button';
        button2.textContent = 'Wstecz';
        button2.addEventListener('click', function () { window.location.href = "index.html"; });
        this.form.appendChild(button2);
        this.content.appendChild(this.div);
        this.content.appendChild(document.createElement('hr'));
        this.content.appendChild(this.form);
    }
    FormCreator.prototype.newForm = function () {
        this.formNew = new Form();
        return this.content;
    };
    FormCreator.prototype.editForm = function (id) {
        this.formNew = (new LocStorage).loadForm(id);
        this.div.innerHTML = "";
        this.div.appendChild(this.formNew.render());
        return this.content;
    };
    FormCreator.prototype.saveForm = function () {
        (new LocStorage).saveForm(this.formNew);
        window.location.href = "index.html";
    };
    return FormCreator;
}());
