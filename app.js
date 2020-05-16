"use strict";
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
    function InputField(nazwa, etykieta) {
        this.typ = FieldType.PoleTekstowe;
        this.nazwa = nazwa;
        this.etykieta = etykieta;
    }
    InputField.prototype.getValue = function () {
        return (this.typ == FieldType.Checkbox) ? this.pole.checked : this.pole.value;
    };
    InputField.prototype.render = function () {
        switch (this.typ) {
            case FieldType.PoleTekstowe:
                this.pole = document.createElement('input');
                this.pole.type = 'text';
                break;
            case FieldType.Data:
                this.pole = document.createElement('input');
                this.pole.type = 'date';
                break;
            case FieldType.Email:
                this.pole = document.createElement('input');
                this.pole.type = 'email';
                break;
            case FieldType.Checkbox:
                this.pole = document.createElement('input');
                this.pole.type = 'checkbox';
                break;
            case FieldType.PoleWielolinijkowe:
                this.pole = document.createElement('textarea');
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
    function SelectField(nazwa, etykieta, opcje) {
        var _this = _super.call(this, nazwa, etykieta) || this;
        _this.typ = FieldType.PoleWyboru;
        _this.pole = document.createElement("select");
        _this.pole.name = _this.nazwa;
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
        return this.pole;
    };
    return SelectField;
}(InputField));
var Form = /** @class */ (function () {
    function Form() {
        this.pola = [];
        this.formularz = document.createElement("form");
        this.pola.push(new InputField("imie", "Imię"));
        this.pola.push(new InputField("nazwisko", "Nazwisko"));
        this.pola.push(new EmailField("email", "E-mail"));
        this.pola.push(new SelectField("kierunek", "Kierunek studiów", ["Fizyka", "Matematyka"]));
        this.pola.push(new CheckboxField("elearning", "Czy preferujesz e-learning?"));
        this.pola.push(new TextAreaField("uwagi", "Uwagi"));
        for (var _i = 0, _a = this.pola; _i < _a.length; _i++) {
            var pole = _a[_i];
            this.formularz.appendChild((new FieldLabel(pole)).render());
            this.formularz.appendChild(pole.render());
        }
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
        new LocStorage().saveDocument(this.getValue());
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
    DocumentList.prototype.render = function () {
        var table = document.createElement("table");
        for (var _i = 0, _a = this.lista; _i < _a.length; _i++) {
            var id = _a[_i];
            var tr = table.insertRow();
            var td = tr.insertCell();
            var a = document.createElement('a');
            a.appendChild(document.createTextNode(id));
            a.href = '#';
            a.addEventListener('click', function (self, id) { return function () { alert(JSON.stringify(self.storage.loadDocument(id))); }; }(this, id));
            td.appendChild(a);
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
    function App() {
        this.form = new Form();
    }
    App.prototype.render = function () {
        return this.form.render();
    };
    return App;
}());
