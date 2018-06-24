# WebApp Generator

- [Introdução](#introdução)
- [Análise de Requisitos](#análise-de-requisitos)
- [Arquitetura do Sistema](#arquitectura-do-sistema)
- [Geradores](#geradores)
    * [Generate-class](#generateClass)
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

Esta função situa-se no *server.js* e o seu objectivo principal é gerar a pasta *Publish* e todas as suas sub-pastas que iram conter todo o conteudo auto-gerado pelos próprios geradores.
Todo o codigo gerado tem em conta as configurações contidas no ficheiro *config.json*.

### generateClass

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

## Soluções e Configurações



## Limitações Existentes



## Modelos e Meta-modelos

