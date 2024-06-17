# Elegibilidade

## Installation


```bash
npm install
```

## Usage
Execute a aplicação com
```bash
npm run start:dev
```
## Tests
Execute os testes unitários com
```bash
npm test
```
### .env
```
ALLOWED_ELIGIBLE_CLASS=comercial,residencial,industrial
ALLOWED_TARIFF_MODALITY=branca,convencional
MONOFASICO=400
BIFASICO=500
TRIFASICO=750
```

## Route
/eligibility [POST] 
### Input example
```json
{
  "numeroDoDocumento": "14041737706",
  "tipoDeConexao": "bifasico",
  "modalidadeTarifaria": "convencional",
  "historicoDeConsumo": [
    3878, 
    9760, 
    5976, 
    2797, 
    2481, 
    5731, 
    7538, 
    4392, 
    7859, 
    4160, 
    6941, 
    4597  
  ]
}
```
