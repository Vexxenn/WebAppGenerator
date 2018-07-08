function generateForm(){
    var schemaGenerator = document.getElementById("SchemaGenerator");
    var entryNumbers = document.getElementById("EntryNumbers").value;
    if(entryNumbers > 0){
        schemaGenerator.textContent = "";
        var form = document.createElement("form");
        form.setAttribute("action", "/generateSchema");
        form.setAttribute("method", "POST");

        var titleLabel = document.createElement("label");
        titleLabel.setAttribute("for", "titleId");
        titleLabel.textContent = "Title"
        var title = document.createElement("input");
        title.setAttribute("id", "titleId");
        title.setAttribute("name", "title");
        title.setAttribute("type", "text");
        title.required = true;
        form.appendChild(titleLabel);
        form.appendChild(title);
        form.appendChild(document.createElement("p"));

        for(let i = 0; i < entryNumbers; i++){
            createTextInput(form, i);
            createInputPicker(form, i);
            createRequiredPicker(form, i);
            createMaxValueAndMinValuePicker(form, i);
            form.appendChild(document.createElement("p"));
        }
        createRelationInput(form);
        createButton(form);
        schemaGenerator.appendChild(form);
    }else{
        schemaGenerator.textContent = "Plz select a possitive number";
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
}