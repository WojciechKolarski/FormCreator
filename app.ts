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
    wartosc: string|boolean,
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
    public wartosc: string|boolean;
    public typ: FieldType = FieldType.PoleTekstowe;
    protected pole: any;
      
    public getValue(): string 
    { 
        return (this.typ == FieldType.Checkbox) ? this.pole.checked : this.pole.value;
    }
    
    constructor(nazwa: string, etykieta: string, wartosc: string|boolean)
    {
        this.nazwa = nazwa;
        this.etykieta = etykieta;
        this.wartosc = wartosc;
    }
    
    public render(): any
    {
        switch(this.typ)
        {
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
    
    constructor(nazwa: string, etykieta: string, opcje: string[], wartosc: string = "")
    {
        super(nazwa, etykieta, wartosc);
        this.pole = document.createElement("select");
        this.pole.name = this.nazwa;
        this.wartosc = wartosc;
        for (let opcja of opcje) 
        {
            this.dodajOpcje(opcja);
        }
    }

    public render(): any
    {
        if(this.wartosc) 
        {
            for(let i = 0; i < this.pole.options.length; i++)
            {
                if(this.pole.options[i].text == this.wartosc)
                {
                    this.pole.options.selectedIndex = i;
                    break;
                } 
            }
        }
        return this.pole;
    }      
}

class Form 
{
    public pola: Field[] = [];
    private formularz: any;
    public id: string;
    constructor()
    {
        this.formularz = document.createElement("form"); 
    }

    public getValue()
    { 
        // let objekt: any = {};
        //for (let pole of this.pola)
        //{
        //   objekt[pole.nazwa] = pole.getValue();
        //}
        //return objekt;

        for (let pole of this.pola)
        {
           pole.wartosc = pole.getValue();
        }
    }

    public render(): any
    {
        this.formularz.innerHTML = "";
        if(this.id)
        {     
            let obj = (new LocStorage()).loadDocument(this.id);
            if (obj)
            {   
                for(let pole of obj.pola)
                {          
                    let p =  new InputField(pole.nazwa, pole.etykieta, pole.wartosc);
                    p.typ = pole.typ;
                    this.pola.push(p); 
                }

            }
        }

        for (let pole of this.pola) 
        {
            this.formularz.appendChild((new FieldLabel(pole)).render()); 
            this.formularz.appendChild(pole.render());
        }

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
       this.getValue();
       (new LocStorage).saveDocument(this);
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
        if (o.indexOf(id) >= 0) return id;
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
    
    public removeDocument(id: string)
    {
        let o = this.getDocuments();
        let i = o.indexOf(id);
        if(i >= 0)
        {
            o.splice(i, 1);
            localStorage.setItem('documents', JSON.stringify(o));
            localStorage.removeItem(id);
        }
    }

    public saveForm(form: any): string
    {
        const id = 'form-' + Date.now();
        localStorage.setItem(id, JSON.stringify(form));
        return this.addDocumentId(id);
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

    public removeDocument(id: string)
    {
        this.storage.removeDocument(id);
    }

    public getDocument(id: string): any
    {
        return this.storage.loadDocument(id);
    }

    public render(): any
    {
        let table = document.createElement("table");
        for (let id of this.lista) 
        {

            
            let tr = table.insertRow();
            let a = document.createElement('a');
            a.appendChild(document.createTextNode(id));
            if(id.substr(0, 4) == 'form')
            {
                a.href = 'new-document.html?id=' + id;
            }
            else
            {
                a.href = 'edit-document.html?id=' + id;
            }
            tr.insertCell().appendChild(a);

            let usun = document.createElement('button');
            usun.type = 'button';
            usun.textContent = 'Usuń';
            usun.addEventListener('click', function(self, id){ return function(){ 
                self.removeDocument(id);
                window.location.reload();            
            }}(this, id));
            tr.insertCell().appendChild(usun);            
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
    private parent: any;
    constructor(id: string)
    {
        this.parent = document.getElementById(id);
    }

    private createDocumentForm(id?: string): Form
    {
       let doc = (new DocumentList).getDocument(id) || {};
       let documentForm = new Form();
       for(let pole of doc.pola)
       {          
           let p =  new InputField(pole.nazwa, pole.etykieta, pole.wartosc);
           p.typ = pole.typ;
           documentForm.pola.push(p); 
       }
       return documentForm.render();
    }

    public editDocument()
    {
        let id = Router.getParam('id');
        if(id) this.parent.appendChild(this.createDocumentForm(id));
    }

    public documentList()
    {
        this.parent.appendChild(new DocumentList().render());
    }

    public newDocument()
    {
        let id = Router.getParam('id');
        if(id)
        {
            let formularz = new Form(); 
            formularz.id = id;
            this.parent.appendChild(formularz.render());
            return;
        }
        this.parent.appendChild(this.createDocumentForm());
    }

    public formCreator()
    {
        let fc = new FormCreator();
        
        let id = Router.getParam('id');
        if(id)
        {
            this.parent.appendChild(fc.editForm(id));
            return;
        } 
        this.parent.appendChild(fc.newForm());
    }


}

class Router
{
    public static getParam(key: string): string
    {
        const query: string = window.location.search.substr(1);
        const urlParams = new URLSearchParams(query);
        return urlParams.get(key); 
    }
}


class FormCreator
{
    private formNew: Form;
    private form: HTMLFormElement;
    private div: HTMLDivElement;
    private content: HTMLDivElement;
    private pola: Field[] = [];
    private button: HTMLButtonElement;
    constructor()
    {
        this.form = document.createElement("form");
        this.div = document.createElement("div");
        this.content = document.createElement("div");

        this.pola.push(new SelectField("type", "Typ pola", ["Pole tekstowe", "Pole wielolinijkowe", "Checkbox"]));
        this.pola.push(new InputField("name", "Nazwa", ""));
        this.pola.push(new InputField("label", "Etykieta", ""));
        this.pola.push(new InputField("value", "Domyślna wartość", ""));

        for (let pole of this.pola) 
        {
            this.form.appendChild((new FieldLabel(pole)).render()); 
            this.form.appendChild(pole.render());
        }      

        this.button = document.createElement('button');
        this.button.type = 'button';
        this.button.textContent = 'Dodaj';
        this.button.addEventListener('click', function(self){ return function(){ 
            switch(self.pola[0].getValue()) 
            {
                case "Pole tekstowe": self.formNew.pola.push(new InputField(self.pola[1].getValue(), self.pola[2].getValue(), self.pola[3].getValue())); break;
                case "Pole wielolinijkowe":self.formNew.pola.push(new TextAreaField(self.pola[1].getValue(), self.pola[2].getValue(), self.pola[3].getValue())); break;
                case "Checkbox": self.formNew.pola.push(new CheckboxField(self.pola[1].getValue(), self.pola[2].getValue(), self.pola[3].getValue())); break;            
            }
            self.div.innerHTML = "";
            self.div.appendChild(self.formNew.render());
        }}(this));
        this.form.appendChild(this.button);
        
        let button1 = document.createElement('button');
        button1.type = 'button';
        button1.textContent = 'Zapisz';
        button1.addEventListener('click', function(self){ return function(){ self.saveForm(); }}(this));
        this.form.appendChild(button1);

        let button2 = document.createElement('button');
        button2.type = 'button';
        button2.textContent = 'Wstecz';
        button2.addEventListener('click', function(){ window.location.href = "index.html"; });   
        this.form.appendChild(button2);

        this.content.appendChild(this.div);
        this.content.appendChild(document.createElement('hr'));
        this.content.appendChild(this.form);
    }

    public newForm(): any
    {
        this.formNew = new Form();
        return this.content;
    }

    public editForm(id: string)
    {
        this.formNew = (new LocStorage).loadDocument(id);
        this.div.innerHTML = "";
        this.div.appendChild(this.formNew.render());
        return this.content;
    }

    public saveForm()
    {
        (new LocStorage).saveForm(this.formNew);
        window.location.href = "index.html";
    }

}

