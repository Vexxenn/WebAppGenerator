function generateForm(){
    var schemaGenerator = document.getElementById("SchemaGenerator");
    var entryNumbers = document.getElementById("EntryNumbers").value;
    if(entryNumbers > 0){
        schemaGenerator.textContent = "";
        var form = document.createElement("form");
        form.setAttribute("action", "/generateSchema");
        form.setAttribute("method", "POST");

        var welcome = document.createElement("h3", "welcome");
        welcome.textContent = "Insert your Data"
        var titleLabel = document.createElement("label");
        titleLabel.setAttribute("for", "titleId");
        titleLabel.textContent = "Title"
        var title = document.createElement("input");
        title.setAttribute("id", "titleId");
        title.setAttribute("name", "title");
        title.setAttribute("type", "text");
        title.required = true;
        form.appendChild(welcome);
        form.appendChild(titleLabel);
        form.appendChild(title);
        form.appendChild(document.createElement("p"));

        for(let i = 0; i < entryNumbers; i++){
            createTextInput(form, i);
            form.appendChild(document.createTextNode('\u00A0'));
            createInputPicker(form, i);
            form.appendChild(document.createTextNode('\u00A0'));
            createRequiredPicker(form, i);
            form.appendChild(document.createTextNode('\u00A0'));
            createMaxValueAndMinValuePicker(form, i);
            form.appendChild(document.createTextNode('\u00A0'));
            createIsUniquePicker(form);
            form.appendChild(document.createElement("p"));
        }
        createRelationInput(form);
        form.appendChild(document.createTextNode('\u00A0'));
        createButton(form);
        schemaGenerator.appendChild(form);
    }else{
        schemaGenerator.textContent = "Please select a positive number";
    }
    
    
}

function createTextInput(element){
    var textBoxLabel = document.createElement("label");
    textBoxLabel.setAttribute("for", "textBoxId");
    textBoxLabel.textContent = "Name of the attribute:";
    var textBox = document.createElement("input");
    textBox.setAttribute("id", "textBoxId");
    textBox.setAttribute("name", "textBox");
    textBox.setAttribute("type", "text");
    textBox.required = true;
    element.appendChild(textBoxLabel);
    element.appendChild(textBox);
}

function createInputPicker(element){
    var typeLabel = document.createElement("label");
    typeLabel.setAttribute("for", "typeDropDownId");
    typeLabel.textContent = "Type of data:";
    var type = document.createElement("select");
    type.setAttribute("id", "typeDropDownId");
    type.setAttribute("name", "typeDropDown");
    var optionString = document.createElement("option");
    var optionNumber = document.createElement("option");
    optionString.text = "string";
    optionNumber.text = "number";
    type.add(optionString);
    type.add(optionNumber);
    element.appendChild(typeLabel);
    element.appendChild(type);
}

function createRequiredPicker(element){
    var isRequiredLabel = document.createElement("label");
    isRequiredLabel.setAttribute("for", "requiredCheckboxId");
    isRequiredLabel.textContent = "Is required:";
    var isRequired = document.createElement("select");
    isRequired.setAttribute("id", "requiredCheckboxId");
    isRequired.setAttribute("name", "requiredCheckbox" );
    var required = document.createElement("option");
    var notRequired = document.createElement("option");
    required.text = "Required";
    notRequired.text = "Not Required";
    isRequired.add(required);
    isRequired.add(notRequired);
    element.appendChild(isRequiredLabel);
    element.appendChild(isRequired);
}

function createMaxValueAndMinValuePicker(element){
    var minValueLabel = document.createElement("label");
    minValueLabel.setAttribute("for", "minValueId" );
    minValueLabel.textContent = "Smallest value possible:";
    var minValue = document.createElement("input");
    minValue.setAttribute("id", "minValueId");
    minValue.setAttribute("name", "minValue");
    minValue.setAttribute("type", "number");
    minValue.setAttribute("value", 0);
    minValue.setAttribute("min", 0);

    
    var maxValueLabel = document.createElement("label");
    maxValueLabel.setAttribute("for", "maxValueId" );
    maxValueLabel.textContent = "Biggest value possible:";
    var maxValue = document.createElement("input");
    maxValue.setAttribute("id", "maxValueId");
    maxValue.setAttribute("name", "maxValue");
    maxValue.setAttribute("type", "number");
    maxValue.setAttribute("value", 0);
    maxValue.setAttribute("min", 0);

    element.appendChild(minValueLabel);
    element.appendChild(minValue);
    element.appendChild(document.createTextNode('\u00A0'));
    element.appendChild(maxValueLabel);
    element.appendChild(maxValue);
}

function createButton(element){
    var submit = document.createElement("input");
    submit.setAttribute("type", "submit");
    element.appendChild(submit);
}

function createRelationInput(element){
    var relationNumber = document.getElementById("RelationNumber").value;
    for(let i = 0; i < relationNumber; i++){
        createRelationNameAndLabelInput(element);
        createRelationtypePicker(element);
        element.appendChild(document.createElement("p"));
    }
}

function createRelationNameAndLabelInput(element){
    var relationLabel = document.createElement("label");
    relationLabel.setAttribute("for", "relationNameId");
    relationLabel.textContent = "Name of the model:";
    var relation = document.createElement("input");
    relation.setAttribute("id", "relationNameId");
    relation.setAttribute("name", "relationName");
    relation.setAttribute("type", "text");
    relation.required = true;
    element.appendChild(relationLabel);
    element.appendChild(relation);
    element.appendChild(document.createTextNode('\u00A0'));

    var relationIdentifierLabel = document.createElement("label");
    relationIdentifierLabel.setAttribute("for", "relationLabelId");
    relationIdentifierLabel.textContent = "Name of the identification element:";
    var relationIdentifier = document.createElement("input");
    relationIdentifier.setAttribute("id", "relationLabelId");
    relationIdentifier.setAttribute("name", "relationLabel");
    relationIdentifier.setAttribute("type", "text");
    relationIdentifier.required = true;
    element.appendChild(relationIdentifierLabel);
    element.appendChild(relationIdentifier);
    element.appendChild(document.createTextNode('\u00A0'));
}

function createRelationtypePicker(element){
    var relationTypeLabel = document.createElement("label");
    relationTypeLabel.setAttribute("for", "relationTypeId");
    relationTypeLabel.textContent = "Relation type:";
    var relationType = document.createElement("select");
    relationType.setAttribute("id", "relationTypeId");
    relationType.setAttribute("name", "relationType" );
    var oneToMany = document.createElement("option");
    var manyToMany = document.createElement("option");
    oneToMany.text = "1-M";
    manyToMany.text = "M-M";
    relationType.add(oneToMany);
    relationType.add(manyToMany);
    element.appendChild(relationTypeLabel);
    element.appendChild(relationType);
    element.appendChild(document.createTextNode('\u00A0'));
}

function createIsUniquePicker(element){
    var isUniqueLabel = document.createElement("label");
    isUniqueLabel.setAttribute("for", "isUniqueId");
    isUniqueLabel.textContent = "Is unique:";
    var isUnique = document.createElement("select");
    isUnique.setAttribute("id", "isUniqueId");
    isUnique.setAttribute("name", "isUnique" );
    var option1 = document.createElement("option");
    var option2 = document.createElement("option");
    option1.text = "Unique";
    option2.text = "Not Unique";
    isUnique.add(option1);
    isUnique.add(option2);
    element.appendChild(isUniqueLabel);
    element.appendChild(isUnique);
}