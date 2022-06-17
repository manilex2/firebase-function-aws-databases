# API DOC

## criptoList

```
    GET /{API_KEY}
```

Obtener Lista con todas las criptos de la base de datos.

### Response Body

```json
    {
        "status": 200,
        "title": "Lista de Criptos",
        "data": [
            {
                "id": 0,
                "name": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## marketDataTotal

```
GET /{API_KEY}
```

Obtener Market Data de todas las criptos.

### Response Body

```json
    {
        "status": 200,
        "title": "Market Data de todas las criptos",
        "data": [
            {
                "id": 0,
                "symbol": "",
                "name": "",
                "description_en": "",
                "description_es": "",
                "homepage": "",
                "blockchain_site": "",
                "twitter_screenname": "",
                "image_thumb": "",
                "image_small": "",
                "image_large": "",
                "sentiment_votes_up_percentage": "",
                "sentiment_votes_down_percentage": "",
                "coingecko_rank": 0,
                "coingecko_score": "",
                "developer_score": "",
                "community_score": "",
                "liquidity_score": "",
                "public_interest_score": "",
                "ath_change_percentage": "",
                "ath_date": "",
                "market_cap": 0,
                "market_cap_rank": 0,
                "total_volume": 0,
                "price_change_percentage_24h": "",
                "price_change_percentage_7d": "",
                "price_change_percentage_30d": "",
                "price_change_percentage_200d": "",
                "price_change_percentage_1y": "",
                "total_supply": 0,
                "max_supply": 0,
                "circulating_supply": 0,
                "last_updated": "",
                "twitter_followers": 0,
                "market_name": "",
                "base": "",
                "target": "",
                "volume": "",
                "converted_volume": "",
                "trust_score": "",
                "trade_url": "",
                "token_info_url": null
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |


## marketDataCripto

```
    GET /{API_KEY}/{cripto}
```

Obtener Market Data de la cripto especificada.

### Response Body

```json
    {
        "status": 200,
        "title": "",
        "data": [
            {
                "id": 0,
                "symbol": "",
                "name": "",
                "description_en": "",
                "description_es": "",
                "homepage": "",
                "blockchain_site": "",
                "twitter_screenname": "",
                "image_thumb": "",
                "image_small": "",
                "image_large": "",
                "sentiment_votes_up_percentage": "",
                "sentiment_votes_down_percentage": "",
                "coingecko_rank": 0,
                "coingecko_score": "",
                "developer_score": "",
                "community_score": "",
                "liquidity_score": "",
                "public_interest_score": "",
                "ath_change_percentage": "",
                "ath_date": "",
                "market_cap": 0,
                "market_cap_rank": 0,
                "total_volume": 0,
                "price_change_percentage_24h": "",
                "price_change_percentage_7d": "",
                "price_change_percentage_30d": "",
                "price_change_percentage_200d": "",
                "price_change_percentage_1y": "",
                "total_supply": 0,
                "max_supply": 0,
                "circulating_supply": 0,
                "last_updated": "",
                "twitter_followers": 0,
                "market_name": "",
                "base": "",
                "target": "",
                "volume": "",
                "converted_volume": "",
                "trust_score": "",
                "trade_url": "",
                "token_info_url": null
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| cripto | ruta | string | true | Criptomoneda que se va a consultar |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## marketDataCriptoMarketName

```
    GET /{API_KEY}/{cripto}/{marketName}
```

Obtener Market Data de la cripto y Market Provider especificado.

### Response Body

```json
    {
        "status": 200,
        "title": "",
        "data": [
            {
                "id": 0,
                "symbol": "",
                "name": "",
                "description_en": "",
                "description_es": "",
                "homepage": "",
                "blockchain_site": "",
                "twitter_screenname": "",
                "image_thumb": "",
                "image_small": "",
                "image_large": "",
                "sentiment_votes_up_percentage": "",
                "sentiment_votes_down_percentage": "",
                "coingecko_rank": 0,
                "coingecko_score": "",
                "developer_score": "",
                "community_score": "",
                "liquidity_score": "",
                "public_interest_score": "",
                "ath_change_percentage": "",
                "ath_date": "",
                "market_cap": 0,
                "market_cap_rank": 0,
                "total_volume": 0,
                "price_change_percentage_24h": "",
                "price_change_percentage_7d": "",
                "price_change_percentage_30d": "",
                "price_change_percentage_200d": "",
                "price_change_percentage_1y": "",
                "total_supply": 0,
                "max_supply": 0,
                "circulating_supply": 0,
                "last_updated": "",
                "twitter_followers": 0,
                "market_name": "",
                "base": "",
                "target": "",
                "volume": "",
                "converted_volume": "",
                "trust_score": "",
                "trade_url": "",
                "token_info_url": null
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| cripto | ruta | string | true | Criptomoneda que se va a consultar |
| marketName | ruta | string | true | Market Provider que se va a consultar |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## segCriptoTotal

```
    GET /{API_KEY}
```

Obtener los datos de seguimiento de oportunidades de todas las criptos.

### Response Body

```json
    {
        "status": 200,
        "title": "",
        "data": [
            {
                "id": 0,
                "cripto": "",
                "indice": "",
                "fecha": "",
                "preop": "",
                "propost": "",
                "p1": "",
                "p2": "",
                "p3": "",
                "p4": "",
                "pm": "",
                "pm2": "",
                "sl": "",
                "sl2": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## segCriptoIndice

```
    GET /{API_KEY}/{indice}
```

Obtener los datos de seguimiento de oportunidades del indice especificado.

### Response Body

```json
    {
        "status": 200,
        "title": "",
        "data": [
            {
                "id": 0,
                "cripto": "",
                "indice": "",
                "fecha": "",
                "preop": "",
                "propost": "",
                "p1": "",
                "p2": "",
                "p3": "",
                "p4": "",
                "pm": "",
                "pm2": "",
                "sl": "",
                "sl2": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| indice | ruta | string | true | Indice de la cripto a consultar |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## precioActualTotal

```
GET /{API_KEY}
```

Obtener el Historico de Precios de todas las criptomonedas.

### Response Body

```json
    {
        "status": 200,
        "title": "Historico de precios de todas las criptos",
        "data": [
            {
                "id": 0,
                "name": "",
                "fecha": "",
                "precio": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |


## precioActualCripto

```
    GET /{API_KEY}/{cripto}
```

Obtener historico de precios de la cripto especificada.

### Response Body

```json
    {
        "status": 200,
        "title": "",
        "data": [
            {
                "id": 0,
                "name": "",
                "fecha": "",
                "precio": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| cripto | ruta | string | true | Criptomoneda que se va a consultar |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## precioActualCriptoFecha

```
    GET /{API_KEY}/{cripto}/{fecha}
```

Obtener precio actual de la cripto para la fecha especificada.

### Response Body

```json
    {
        "status": 200,
        "title": "",
        "data": [
            {
                "id": 0,
                "name": "",
                "fecha": "",
                "precio": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| cripto | ruta | string | true | Criptomoneda que se va a consultar |
| fecha | ruta | string | true | Fecha que se va a consultar en formato aaaa-mm-dd |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |
