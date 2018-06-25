# WebApp Generator

- [Introdução](#introdução)
- [Análise de Requisitos](#análise-de-requisitos)
- [Arquitetura do Sistema](#arquitectura-do-sistema)
- [Geradores](#geradores)
    * [generate-class.js](#generate-class)
    * [generate-database.js](#generate-database)
- [Soluções e Configurações](#soluções-e-configurações)
- [Limitações Existentes](#limitações-existentes)
- [Modelos e Meta-modelos](#modelos-e-meta-modelos)

## Introdução

Este projecto foi desenvolvido como projecto de avaliação da cadeira de Desenvolvimento Baseado em Modelos e com o intuito de desenvolver conhecimentos em como gerar aplicações através de modelos previamente contruídos.

## Análise de Requisitos



## Arquitectura do Sistema



## Geradores

Existem duas funções geradoras na pasta Models, uma para gerar as classes (*generate-class.js*) e outra para gerar a base de dados (*generate-database.js*). Estas geram a base de dados e classes utilizadas no programa gerado através da leitura de schemas em json que determinam o que deve ser gerado tendo em conta as relações entre si, os dados que precisam de ser guardados em base de dados, e como estes devem ser acedidos através das classes criadas.

Os geradores são primeiro chamados na função:
```javascript
function generateServer(cssStyle)
```

Esta função situa-se no *server.js* e o seu objectivo principal é gerar a pasta *Publish* e todas as suas sub-pastas que iram conter todo o conteudo auto-gerado pelos geradores.
Todo o codigo gerado tem em conta as configurações contidas no ficheiro *config.json*.

### generate-class

```javascript
function generateClass(schema)
```

O principal proposito do `generateClass` é de criar classes (de acordo com o(s) schema(s) passado(s))  usando o *class.mustache* para construir facilmente os ficheiros (classes) que iram ficar na pasta *Models* do *Publish*.

O funcionamento desta função é simples. Recebe um schema, que é um ficheiro do tipo json que contem a informação completa da class que pretendemos gerar, e lendo as propriedades nele contido, criamos uma serie de strings. Estas strings quando usadas em conjunção com o *class.mustache* gera um ficheiro que representa uma class que corresponde ao schema usado.

```javascript
fs.readFile('./Models/class.mustache', function (err, data) {
        var output = mustache.render(data.toString(), classInfo);
        fs.appendFile('./Publish/Models/' + classInfo.classTitle + '.js', '', function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        var path = "./Publish/Models/" + classInfo.classTitle + ".js";
        fs.writeFile(path, output, function () {
        })
    });
```

Este bloco de codigo é responsavel pela criação em si do ficheiro .js correspondente ao schema lido. 
É usado o `mustache.render` passando a informação da classe em várias variaveis do tipo string usando a `classInfo` e por fim o ficheiro criado é colocado no caminho *./Publish/Models/*. 

### generate-database

O ficheiro *generate-database.js* partilha muito da lógica descrita em [generate-class](#generate-class), mas em vez de criar classes apropriadas à manipulação dos dados de um schema, este gera as tabelas e relações de base dados de um ou vários schemas.

```javascript
function generate(schema)
```

Esta é a função que é chamada através do nome `GenerateDataBase` ao usar o *generate-database.js* e ao receber o caminho para o ficheiro de configuração *config.json*, fica responsavel por criar as várias tabelas de uma base de dados, que tem em conta todos os schemas usados na criação/utilização da WebApp.

Para executar as suas tarefas, a função *generate* usa outras funções auxiliares contidas no ficheiro *generate-database.js*. Estas são: [run](#run); [checkCompleted](#checkcompleted); [generateRelationObject ](#generaterelationobject ); [generateRelations](#generaterelations); [getModelPosition](#getmodelposition); [checkIfAllTrue](#checkifalltrue); [checkType](#checktype); [checkRequiered](#checkrequiered); [isUnique](#isunique);

#### run

```javascript
function run(path, db, modelList, tableRelations, dbQuerys)
```

Esta função lê o json schema para cada um dos elementos no config.json e cria as respectivas tabelas com as suas relações. Recebe como parametros algumas variavéis que permitem guardar todos os modelos que são processados e guardar todas as querys. Esses parametros são: o modulo que contem a base de dado, a lista de modelos, uma variavel que contem os objectos que vão gerar as querys de relações, e também uma variavel, que irá conter todas as querys.

O seu funcionamento decorre da seguinte forma:

```javascript
var tableProperties = "";
        tableProperties += object.title + "_id " + "INTEGER PRIMARY KEY,\n";
        for (var i = 0; i < objectProperties.length; i++) {
            tableProperties += objectProperties[i] + " " + checkType(object.properties[objectProperties[i]].type) + ""
                + checkRequiered(objectProperties[i], object.required) + "" + isUnique(object.properties[objectProperties[i]].unique);
            i == objectProperties.length - 1 ? tableProperties += "\n" : tableProperties += ",\n";
        }
```

- Criamos (como string) as propiedades da tabela da base de dados a criar;

```javascript
if (object.references != undefined) {
            generateRelationObject(object, tableRelations);
        }
```

- Geramos objectos que contêm a informação/querys de relação da tabela;

```javascript
fs.readFile('./Models/Database/create-table.mustache', function (err, content) {
            if (err) throw err;
            var output = mustache.render(content.toString(), mustacheObject);
            dbQuerys.push(output);
            var position = getModelPosition(modelList, object.title);
            modelList[position].isDone = true;
            if (checkIfAllTrue(modelList)) {
                generateRelations(tableRelations, db, dbQuerys);
            }
        });
```

- Por fim, criamos as querys finais e geramos a tabela em si.

#### checkCompleted

```javascript
function checkCompleted(tableRelations, db, dbQuerys)
```

Esta função é usada para executar todos as querys na base de dados, e só é usada quando todas as querys foram criadas e ordenadas. Isto impossibilita a execução de querys que dependem de outras tabelas que podem ainda não ter sido criadas.

#### generateRelationObject

```javascript
function generateRelationObject(schema, relationObjects)
```

Esta função é usada para gerar os objectos que iram conter toda a informação necessária para criar as constrains das querys.

*Nota: A função faz uso de uma variavel booleana para controlar se o objecto já foi procesado e se a query já foi criada.*

#### generateRelations

```javascript
function generateRelations(relationList, db, dbQuerys)
```



#### getModelPosition

```javascript
function getModelPosition(models, name)
```



#### checkIfAllTrue

```javascript
function checkIfAllTrue(modelList)
```



#### checkType

```javascript
function checkType(propertie)
```



#### checkRequiered

```javascript
function checkRequiered(element, requiredList)
```



#### isUnique

```javascript
function isUnique(element)
```



## Soluções e Configurações



## Limitações Existentes



## Modelos e Meta-modelos

