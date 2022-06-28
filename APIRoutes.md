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
        "title": "Market data de {cripto}",
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
                "twitter_followers": 0
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
        "title": "Market Data de {cripto} para {marketName}",
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

## marketDataCriptoListExchange

```
    GET /{API_KEY}/{cripto}/list/exchanges
```

Obtener La Lista de exchanges de una cripto.

### Response Body

```json
    {
        "status": 200,
        "title": "Lista de Exchanges de {cripto}",
        "data": [
            {
                "market_name": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| cripto | ruta | string | true | Criptomoneda que se va a consultar |
| list | ruta | string | true | Se le asigna que nos traiga una lista |
| exchanges | ruta | string | true | Nos trae los exchanges de esa criptomoneda |

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
        "title": "Seguimiento de Oportunidades General",
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
        "title": "Seguimiento de Oportunidades para {indice}",
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
        "title": "Historico de precios para {cripto}",
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
        "title": "Market Data de {cripto} para {fecha}",
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

## chartProyecciones

```
GET /{API_KEY}
```

Obtener la lista de graficos de Proyecciones, SmartBands y Rentabilidad.

### Response Body

```json
    {
        "status": 200,
        "title": "Lista de Graficos de Proyecciones, SmartBands y Rentabilidad",
        "data": [
            {
                "id": 0,
                "nombre": "",
                "fecha": "",
                "precio": "",
                "proy_lp": "",
                "smartbands_lp": "",
                "rent_lp": "",
                "proy_cp": "",
                "smartbands_cp": "",
                "rent_cp": ""
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

## idosIcosTotal

```
GET /{API_KEY}
```

Obtener la lista de IDOs e ICOs.

### Response Body

```json
    {
        "status": 200,
        "title": "Lista de IDOs e ICOs",
        "data": [
            {
                "id": 0,
                "fecha": "",
                "nombre": "",
                "symbol": "",
                "resumen": "",
                "banner": "",
                "icono": "",
                "link_whitepaper": "",
                "proyecto_realizable": "",
                "seg_informatica": "",
                "whitepaper_integro": "",
                "calificacion_innovacion": 0,
                "calificacion_tecnologia": 0,
                "calificacion_programacion": 0,
                "calificacion_plan_futuro": 0,
                "calificacion_equipo": 0,
                "calificacion_total": "",
                "exchange_disp": "",
                "precio_venta": "",
                "id_precio": "",
                "data_price": "",
                "precio_actual": "",
                "rentabilidad_generada": "",
                "banner_venta": "",
                "fecha_max_kyc": "",
                "inicio_staking": "",
                "fin_staking": "",
                "fecha_venta": "",
                "link_kyc": "",
                "compra_mon_base": "",
                "creacion_cuenta_exchange": "",
                "registro_ido": "",
                "comentario_adic": ""
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

## idosIcosBettersRentability

```
    GET /{API_KEY}/bettersRentability
```

Obtener los IDOs e ICOs de las criptomonedas con las mejores rentabilidades generadas limitando a 4.

### Response Body

```json
    {
        "status": 200,
        "title": "Mejor Rentabilidad de IDOs e ICOs",
        "data": [
            {
                "id": 0,
                "fecha": "",
                "nombre": "",
                "symbol": "",
                "resumen": "",
                "banner": "",
                "icono": "",
                "link_whitepaper": "",
                "proyecto_realizable": "",
                "seg_informatica": "",
                "whitepaper_integro": "",
                "calificacion_innovacion": 0,
                "calificacion_tecnologia": 0,
                "calificacion_programacion": 0,
                "calificacion_plan_futuro": 0,
                "calificacion_equipo": 0,
                "calificacion_total": "",
                "exchange_disp": "",
                "precio_venta": "",
                "id_precio": "",
                "data_price": "",
                "precio_actual": "",
                "rentabilidad_generada": "",
                "banner_venta": "",
                "fecha_max_kyc": "",
                "inicio_staking": "",
                "fin_staking": "",
                "fecha_venta": "",
                "link_kyc": "",
                "compra_mon_base": "",
                "creacion_cuenta_exchange": "",
                "registro_ido": "",
                "comentario_adic": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| bettersRentability | ruta | string | true | Trae los datos con las mejores rentabilidades generadas |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## oportCriptoLinksTotal

```
GET /{API_KEY}
```

Obtener la lista de Datos de Oportunidades.

### Response Body

```json
    {
        "status": 200,
        "title": "Oportunidades Datos",
        "data": [
            {
                "id": 0,
                "cuenta_actual": "",
                "cuenta_historico": "",
                "cuenta_unificada": "",
                "tipo": "",
                "fecha_publicacion": "",
                "symbol": "",
                "nombre": "",
                "precio_entrada_1": "",
                "precio_entrada_2": "",
                "precio_entrada_3": "",
                "precio_entrada_4": "",
                "precio_meta_1": "",
                "precio_meta_2": "",
                "stop_loss": "",
                "trade_hold": "",
                "nivel_riesgo": "",
                "exchange": "",
                "logo": "",
                "id_precio": "",
                "data_price": "",
                "precio_actual": "",
                "valido_hasta": "",
                "rentabilidad_estimada": "",
                "recomendar": "",
                "chart": "",
                "rentabilidad_generada": "",
                "rentabilidad_numerica": "",
                "recomendacion_caduca": "",
                "mostrar_hasta": "",
                "riesgo_estrella": 0,
                "chart_seguimiento": "",
                "widget_symbol": "",
                "analisis_grafico": ""
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

## oportCriptoLinksHistorico

```
    GET /{API_KEY}/historico
```

Obtener los datos de oportunidades historicos donde posean el tipo de Oportunidad Historica y que la fecha de mostrar_hasta sea mayor o igual a la fecha actual.

### Response Body

```json
    {
        "status": 200,
        "title": "Historico",
        "data": [
            {
                "id": 0,
                "cuenta_actual": "",
                "cuenta_historico": "",
                "cuenta_unificada": "",
                "tipo": "",
                "fecha_publicacion": "",
                "symbol": "",
                "nombre": "",
                "precio_entrada_1": "",
                "precio_entrada_2": "",
                "precio_entrada_3": "",
                "precio_entrada_4": "",
                "precio_meta_1": "",
                "precio_meta_2": "",
                "stop_loss": "",
                "trade_hold": "",
                "nivel_riesgo": "",
                "exchange": "",
                "logo": "",
                "id_precio": "",
                "data_price": "",
                "precio_actual": "",
                "valido_hasta": "",
                "rentabilidad_estimada": "",
                "recomendar": "",
                "chart": "",
                "rentabilidad_generada": "",
                "rentabilidad_numerica": "",
                "recomendacion_caduca": "",
                "mostrar_hasta": "",
                "riesgo_estrella": 0,
                "chart_seguimiento": "",
                "widget_symbol": "",
                "analisis_grafico": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| historico | ruta | string | true | Trae los datos que contienen oportunidades historicas |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## oportCriptoLinksHistoricoBettersRentability

```
    GET /{API_KEY}/historico/bettersRentability
```

Obtener los datos de oportunidades historicos donde posean el tipo de Oportunidad Historica y que la fecha de mostrar_hasta sea mayor o igual a la fecha actual con las mejores rentabilidades numericas limitando a 5.

### Response Body

```json
    {
        "status": 200,
        "title": "Historico con las Mejores Rentabilidades Numericas",
        "data": [
            {
                "id": 0,
                "cuenta_actual": "",
                "cuenta_historico": "",
                "cuenta_unificada": "",
                "tipo": "",
                "fecha_publicacion": "",
                "symbol": "",
                "nombre": "",
                "precio_entrada_1": "",
                "precio_entrada_2": "",
                "precio_entrada_3": "",
                "precio_entrada_4": "",
                "precio_meta_1": "",
                "precio_meta_2": "",
                "stop_loss": "",
                "trade_hold": "",
                "nivel_riesgo": "",
                "exchange": "",
                "logo": "",
                "id_precio": "",
                "data_price": "",
                "precio_actual": "",
                "valido_hasta": "",
                "rentabilidad_estimada": "",
                "recomendar": "",
                "chart": "",
                "rentabilidad_generada": "",
                "rentabilidad_numerica": "",
                "recomendacion_caduca": "",
                "mostrar_hasta": "",
                "riesgo_estrella": 0,
                "chart_seguimiento": "",
                "widget_symbol": "",
                "analisis_grafico": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| historico | ruta | string | true | Indica que se filtraran oportunidades historicas |
| bettersRentability | ruta | string | true | Trae los datos con las mejores rentabilidades numericas |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## oportCriptoLinksHistoricoGroupByDate

```
    GET /{API_KEY}/historico/groupByDate
```

Obtener los datos de oportunidades historicos donde posean el tipo de Oportunidad Historica y que la fecha de mostrar_hasta sea mayor o igual a la fecha actual ordenados por fecha de publicacion en forma descendente.

### Response Body

```json
    {
        "status": 200,
        "title": "Historico Agrupado por Fechas en Orden Descendente",
        "data": [
            {
                "id": 0,
                "cuenta_actual": "",
                "cuenta_historico": "",
                "cuenta_unificada": "",
                "tipo": "",
                "fecha_publicacion": "",
                "symbol": "",
                "nombre": "",
                "precio_entrada_1": "",
                "precio_entrada_2": "",
                "precio_entrada_3": "",
                "precio_entrada_4": "",
                "precio_meta_1": "",
                "precio_meta_2": "",
                "stop_loss": "",
                "trade_hold": "",
                "nivel_riesgo": "",
                "exchange": "",
                "logo": "",
                "id_precio": "",
                "data_price": "",
                "precio_actual": "",
                "valido_hasta": "",
                "rentabilidad_estimada": "",
                "recomendar": "",
                "chart": "",
                "rentabilidad_generada": "",
                "rentabilidad_numerica": "",
                "recomendacion_caduca": "",
                "mostrar_hasta": "",
                "riesgo_estrella": 0,
                "chart_seguimiento": "",
                "widget_symbol": "",
                "analisis_grafico": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| historico | ruta | string | true | Indica que se filtraran oportunidades historicas |
| groupByDate | ruta | string | true | Ordena los datos por fecha de publicacion |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## oportCriptoLinksTradeHoldTransaccion

```
    GET /{API_KEY}/tradehold/{transaccion}
```

Obtener los datos de oportunidades filtrando por transaccion.

### Response Body

```json
    {
        "status": 200,
        "title": "Trade Hold de {transaccion}",
        "data": [
            {
                "id": 0,
                "cuenta_actual": "",
                "cuenta_historico": "",
                "cuenta_unificada": "",
                "tipo": "",
                "fecha_publicacion": "",
                "symbol": "",
                "nombre": "",
                "precio_entrada_1": "",
                "precio_entrada_2": "",
                "precio_entrada_3": "",
                "precio_entrada_4": "",
                "precio_meta_1": "",
                "precio_meta_2": "",
                "stop_loss": "",
                "trade_hold": "",
                "nivel_riesgo": "",
                "exchange": "",
                "logo": "",
                "id_precio": "",
                "data_price": "",
                "precio_actual": "",
                "valido_hasta": "",
                "rentabilidad_estimada": "",
                "recomendar": "",
                "chart": "",
                "rentabilidad_generada": "",
                "rentabilidad_numerica": "",
                "recomendacion_caduca": "",
                "mostrar_hasta": "",
                "riesgo_estrella": 0,
                "chart_seguimiento": "",
                "widget_symbol": "",
                "analisis_grafico": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| tradehold | ruta | string | true | Indica que se va a filtrar por tradehold |
| transaccion | ruta | string | true | Trae los datos de acuerdo de la transaccion. Estas pueden ser: Trade u Hold |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## oportCriptoLinksTrades

```
    GET /{API_KEY}/trade
```

Obtener los datos de oportunidades donde sean una transaccion Trade y haya una Oportunidad Activa.

### Response Body

```json
    {
        "status": 200,
        "title": "Trades",
        "data": [
            {
                "id": 0,
                "cuenta_actual": "",
                "cuenta_historico": "",
                "cuenta_unificada": "",
                "tipo": "",
                "fecha_publicacion": "",
                "symbol": "",
                "nombre": "",
                "precio_entrada_1": "",
                "precio_entrada_2": "",
                "precio_entrada_3": "",
                "precio_entrada_4": "",
                "precio_meta_1": "",
                "precio_meta_2": "",
                "stop_loss": "",
                "trade_hold": "",
                "nivel_riesgo": "",
                "exchange": "",
                "logo": "",
                "id_precio": "",
                "data_price": "",
                "precio_actual": "",
                "valido_hasta": "",
                "rentabilidad_estimada": "",
                "recomendar": "",
                "chart": "",
                "rentabilidad_generada": "",
                "rentabilidad_numerica": "",
                "recomendacion_caduca": "",
                "mostrar_hasta": "",
                "riesgo_estrella": 0,
                "chart_seguimiento": "",
                "widget_symbol": "",
                "analisis_grafico": ""
            }
        ]
    }
```

### Parametros

| Parametro | ln | Tipo | Requerido | Descripcion |
| --------- | --------- | --------- | --------- | --------- |
| API_KEY | ruta | string | true | API KEY para conectarse a la API |
| trade | ruta | string | true | Trae los datos de la transaccion |

### Respuestas

| Status | Significado | Descripcion |
| --------- | --------- | --------- |
| 200 | OK | data success |
| 400 | Bad Request | Data no existe |

## planesTotal

```
GET /{API_KEY}
```

Obtiene los planes que existen en la App.

### Response Body

```json
    {
        "status": 200,
        "title": "Planes",
        "data": [
            {
                "planId": 0,
                "plan": "",
                "categoria": "",
                "titulo": "",
                "detalle": "",
                "descripcion": "",
                "activo": 0
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

## usuariosTotal

```
GET /{API_KEY}
```

Obtiene los usuarios que existen en la App.

### Response Body

```json
    {
        "status": 200,
        "title": "Usuarios",
        "data": [
            {
                "userId": 1,
                "email": "",
                "usuarioId": 0,
                "fullName": "",
                "nombre": "",
                "affiliate_code": "",
                "planId": 0,
                "foto": "",
                "perfil_inv": "",
                "usuario_discord": "",
                "whatsapp": 0,
                "usuario_activo": 0
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

## createCurrentPriceTable

```
GET /{API_KEY}
```

Crea tablas en Firebase en la tabla de Precio actual.

### Response Body

```json
    {
        "msg": ""
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