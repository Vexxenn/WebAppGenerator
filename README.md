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

Esta função cria as querys à base de dados, que adicionam chaves estrangeiras ás tabelas que têm relações 1-M. Caso a tabela não tenha uma relação 1-M, irá então criar uma nova tabela para gerir as relações entre tabelas.
*Nota: A variavel `relationList` contem a informação necessária à criação das querys e contêm também uma variavel que indica se a criação da query já concluiu.*

#### getModelPosition

```javascript
function getModelPosition(models, name)
```

Esta função é usada para determinar a posição de um modelo que já foi processado.

#### checkIfAllTrue

```javascript
function checkIfAllTrue(modelList)
```

Esta função é usada de forma a apenas permitir que o programa avençe para o proximo estado, se todos os objectos, na lista que é passada como argumento, já foram processados. É uma função fundamental pois garante que todos os modelos já foram processados antes de criar chaves estrangeiras na base de dados, assim evitando ligações a tabelas que ainda não existem.

#### checkType

```javascript
function checkType(propertie)
```

Esta função é usada para ajudar na criação das tabelas, pois verifica que tipo de elemento deve ser criado na tabela.

#### checkRequiered

```javascript
function checkRequiered(element, requiredList)
```

Esta função é usada de forma a saber se um elemento pode ou não ter o seu campo a nulo, para que quando for criada a tabela, colocar-se (ou não) o termo *"NOT NULL"*.

#### isUnique

```javascript
function isUnique(element)
```

Esta função é usada para ajudar na criação da tabela, ao ajudar na verificação de se um elemento pode ou não ser unico.

## Soluções e Configurações

A configuração da aplicação é feita através da edição dos dados contidos no ficheiro Config.json, e estes dados determinam enumeros factores da aplicação que é gerada automaticamente.

```json
/.../
  "port": "8084",
  "dbname":"labs.db",
/.../
```

No exemplo acima podemos ver que conseguimos controlar o número da porta de escuta da aplicação gerada, assim como o nome da base de dados para os diferentes modelos que a aplicação pode contemplar. Modelos esses que podem ser configurados da seguinte forma:

```json
/.../
"models":[
      {"name":"Sale", "path": "../WebAppGenerator/Models/Schemas/SaleSchema.json", "isDone": false},
      {"name":"Type", "path": "../WebAppGenerator/Models/Schemas/TypeSchema.json", "isDone": false},
      {"name":"Brand", "path": "../WebAppGenerator/Models/Schemas/BrandSchema.json", "isDone": false},
      {"name":"Product", "path": "../WebAppGenerator/Models/Schemas/ProductSchema.json", "isDone": false}
  ],
/.../
```

Como podemos ver é necessário indicar o caminho para os diferentes modelos, assim como descerver o seu nome e adicionar o parametro `isDone` que é utilizado na geração das tabelas da base de dados.

As restantes configurações são a nivel da aparencia da aplicação gerada e o restante *frontoffice*.

```json
/.../
"cssFiles":[
    {"path": "../WebAppGenerator/Static/Style1.css", "style": "Style1"},
    {"path": "../WebAppGenerator/Static/Style2.css", "style": "Style3"}
  ],
  "frontoffice": {
    "model": "Product",
    "property": "price",
    "order": "DESC",
    "limit": 3
  },
/.../
```

Tal como mostrado neste exerto do ficheiro, pode-se adicionar enumeros géneros de configurações, desde que estes sejam contemplados e validados na criação da aplicação gerada.
Neste caso temos um exemplo com uma listagem dos vários ficheiros css que podem ser usados na criação da aplicação e um outro exemplo da configuração de como devem ser mostrados os dados do modelo *Product* indicando o tipo de ordenação, qual a propriedade que deve ser ordenada e o limite de produtos, ao serem visualizados na página html.

## Limitações Existentes

No decorrer da criação da aplicação foram encontrados vários problemas, sendo que alguns foram rapidamente resolvidos e outros prolongaram-se até à data actual. Existem três limitações na aplicação que provaram ser complexos problemas de se resolver.

Uma das limitações tem a ver com a visualização de relações M-M na aplicação gerada. Quando se navela para uma página que contem informações com relações M-M, as *checkboxes* da lista não ficam pré-selecionadas.

As restantes duas limitações têm a ver com problemas de sincronismo em duas partes diferentes.
Uma tem a ver com problemas quando se tenta ir buscar à base de dados o ultimo id após inserção de dados (como aconteçe no *class.mustache*).
A segunda limitação deste genero, tem a ver com a criação da aplicação auto-gerada, quando se tenta mover ficheiros da pasta *Static* para uma das sub-pastas do *Publish* antes de estas terem sido criadas.

## Modelos e Meta-modelos

