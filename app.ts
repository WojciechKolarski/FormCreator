enum FieldType
{
    PoleTekstowe,
    PoleWielolinijkowe,
    Data,
    Email, 
    PoleWyboru,
    Checkbox
}

interface Field
{
    nazwa: string,
    etykieta: string,
    typ: FieldType,
    getValue(): string,
    render(): any
}

class FieldLabel 
{
    private pole: Field;
    constructor(pole: Field)
    {
        this.pole = pole;
    }
    public render(): any
    {
        let label = document.createElement('label');
        label.setAttribute('for', this.pole.nazwa);
        label.innerText = this.pole.etykieta;
        return label;
    }
}
    
class InputField implements Field 
{
    public nazwa: string; 
    public etykieta: string;
    public typ: FieldType = FieldType.PoleTekstowe;
    protected pole: any;
      
    public getValue(): string 
    { 
        return (this.typ == FieldType.Checkbox) ? this.pole.checked : this.pole.value;
    }
    
    constructor(nazwa: string, etykieta: string)
    {
        this.nazwa = nazwa;
        this.etykieta = etykieta;
    }
    
    public render(): any
    {
        switch(this.typ)
        {
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
    }
}

class DateField extends InputField
{
    readonly typ: FieldType = FieldType.Data;
}

class EmailField extends InputField
{
    readonly typ: FieldType = FieldType.Email;
}

class CheckboxField extends InputField
{
    readonly typ: FieldType = FieldType.Checkbox;
}

class TextAreaField extends InputField
{
    readonly typ: FieldType = FieldType.PoleWielolinijkowe;
}

class SelectField extends InputField
{
    readonly typ: FieldType = FieldType.PoleWyboru;
    private dodajOpcje(tekst: string)
    {
        let option = document.createElement('option'); 
        option.text = tekst;
        this.pole.add(option);
    }
    
    constructor(nazwa: string, etykieta: string, opcje: string[])
    {
        super(nazwa, etykieta);
        this.pole = document.createElement("select");
        this.pole.name = this.nazwa;
        for (let opcja of opcje) 
        {
            this.dodajOpcje(opcja);
        }
    }

    public render(): any
    {
        return this.pole;
    }      
}

class Form 
{
    private pola: Field[] = [];
    private formularz: any;
    constructor()
    {
        this.formularz = document.createElement("form");    
        this.pola.push(new InputField("imie", "Imię"));
        this.pola.push(new InputField("nazwisko", "Nazwisko"));
        this.pola.push(new EmailField("email", "E-mail"));
        this.pola.push(new SelectField("kierunek", "Kierunek studiów", ["Fizyka", "Matematyka"]));
        this.pola.push(new CheckboxField("elearning", "Czy preferujesz e-learning?"));
        this.pola.push(new TextAreaField("uwagi", "Uwagi"));
        for (let pole of this.pola) 
        {
            this.formularz.appendChild((new FieldLabel(pole)).render()); 
            this.formularz.appendChild(pole.render());
        }
    }

    public getValue(): any
    { 
        let objekt: any = {};
        for (let pole of this.pola)
        {
           objekt[pole.nazwa] = pole.getValue();
        }
        return objekt;
    }

    public render(): any
    {
        let button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Zapisz';
        button.addEventListener('click', function(self){ return function(){ self.save(); }}(this));
        this.formularz.appendChild(button);

        let button2 = document.createElement('button');
        button2.type = 'button';
        button2.textContent = 'Wstecz';
        button2.addEventListener('click', function(){ window.location.href = "index.html"; });   
        this.formularz.appendChild(button2);
        return this.formularz;
    }

    public save(): void
    {
       new LocStorage().saveDocument(this.getValue());
       window.location.href = "index.html";
    }

}

interface DataStorage
{
	saveDocument(doc: any): string;
	loadDocument(id: string): any;
	getDocuments(): string[];
}

class LocStorage implements DataStorage
{

    public saveDocument(dokument: any): string 
    {
        const id = 'document-' + Date.now();
    	localStorage.setItem(id, JSON.stringify(dokument));
		return this.addDocumentId(id);
    }
    
    private addDocumentId(id: string): string
    {
        let o = this.getDocuments();
        o.push(id);
        localStorage.setItem('documents', JSON.stringify(o));
        return id;
    }

    public loadDocument(id: string): any
    {
        let o = localStorage.getItem(id);
        if (o) return JSON.parse(o);
        return null;
	}

    public getDocuments(): string[] 
    {
        let o = localStorage.getItem('documents');
        if(o) return JSON.parse(o);
        return [];
	}
}


class DocumentList
{
    public lista: string[] = [];
    private storage: LocStorage = new LocStorage();
    constructor()
    {
        this.getDocumentList();
    }

    public getDocumentList()
    {
       this.lista = this.storage.getDocuments();
    }

    public render(): any
    {
        let table = document.createElement("table");
        for (let id of this.lista) 
        {
            let tr = table.insertRow();
            let td = tr.insertCell();
            let a = document.createElement('a');
            a.appendChild(document.createTextNode(id));
            a.href= '#';
            a.addEventListener('click', function(self, id){ return function(){ alert(JSON.stringify(self.storage.loadDocument(id))); }}(this, id));
            td.appendChild(a);
        }

        let button = document.createElement('button');
        button.type = 'button';
        button.textContent = 'Wstecz';
        button.addEventListener('click', function(){ window.location.href = "index.html"; });   
        table.appendChild(button);

        return table;   
    }
}

class App
{
    private form: Form;
    constructor()
    {
        this.form = new Form();
    }
    public render(): any
    {
        return this.form.render();
    }
}