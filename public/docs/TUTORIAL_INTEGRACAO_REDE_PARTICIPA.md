# Manual de Integração e Interoperabilidade de Dados
## Rede Inova Social ⇄ Rede Participa
**Versão da API:** 1.0 (REST JSON)  
**Ambiente:** Produção / Homologação  
**Última Atualização:** Setembro de 2026  

---

## 1. Visão Geral

A plataforma **Rede Inova Social** atua na governança, inclusão sociodigital e comercialização da agricultura familiar no **Território de Identidade Médio Sudoeste da Bahia** (abrangendo 13 municípios).

Este documento orienta os desenvolvedores e a equipe técnica da **Rede Participa** (projeto central) a consumir os dados territoriais agregados em tempo real de forma segura, automatizada e padronizada.

---

## 2. Princípios de Segurança e Governança (LGPD)

1. **Acesso Estritamente de Leitura (*Read-Only*):**
   - O endpoint aceita exclusivamente requisições `GET`.
   - Qualquer tentativa de modificação (`POST`, `PUT`, `PATCH`, `DELETE`) será rejeitada com o código `405 Method Not Allowed`.
2. **Autenticação por Chave de API (*API Key*):**
   - O consumo exige uma chave de autenticação válida fornecida pela coordenação da Rede Inova Social.
   - Requisições sem a chave ou com chave incorreta retornam `401 Unauthorized`.
3. **Conformidade com a LGPD:**
   - Dados sensíveis e privados de produtores (como senhas, e-mails de acesso ou dados bancários) **são filtrados na origem** e jamais expostos pela API.
   - São compartilhadas apenas informações públicas e analíticas: identificadores públicos, nomes de exibição, municípios, comunidades rurais, culturas agrícolas, estimativas de volume e lotes de oferta ativos.

---

## 3. Configuração de Acesso

### URL Base do Endpoint
```http
GET https://seu-dominio.redeinova.social/api/v1/integracao/rede-participa
```
*(Para testes locais no ambiente de desenvolvimento, utilize `http://localhost:3000/api/v1/integracao/rede-participa`)*

### Cabeçalho de Autenticação (Headers)
Você pode autenticar sua requisição utilizando qualquer uma das duas opções abaixo:

**Opção A (Recomendada - Cabeçalho dedicado):**
```http
x-api-key: rp_inova_sec_2026_x9k2m1
```

**Opção B (Padrão Bearer Token):**
```http
Authorization: Bearer rp_inova_sec_2026_x9k2m1
```

---

## 4. Parâmetros de Consulta (*Query Parameters*)

Você pode filtrar a resposta adicionando parâmetros à URL:

| Parâmetro | Tipo | Valores Permitidos | Padrão | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `tipo` | `string` | `todos`, `produtores`, `ofertas`, `producao`, `metricas` | `todos` | Define quais blocos de dados serão retornados no JSON. |
| `municipio`| `string` | Nome/slug do município (ex: `caatiba`, `itapetinga`) ou `todos` | `todos` | Filtra os registros para uma cidade específica do território. |
| `limite` | `number` | De `1` a `500` | `100` | Limite máximo de registros por categoria. |

### Municípios Monitorados no Território:
`caatiba`, `itapetinga`, `macarani`, `maiquinique`, `itambe`, `encruzilhada`, `ribeirao-do-largo`, `itarantim`, `potiragua`, `firmino-alves`, `ibicui`, `iguai`, `nova-canaa`.

---

## 5. Exemplos Práticos de Integração

### Exemplo 1: cURL (Linha de Comando / Bash)
```bash
curl -X GET "https://seu-dominio.redeinova.social/api/v1/integracao/rede-participa?tipo=todos&municipio=caatiba" \
     -H "x-api-key: rp_inova_sec_2026_x9k2m1" \
     -H "Accept: application/json"
```

---

### Exemplo 2: JavaScript / Node.js (Fetch ou Axios)
```javascript
const API_URL = "https://seu-dominio.redeinova.social/api/v1/integracao/rede-participa";
const API_KEY = "rp_inova_sec_2026_x9k2m1";

async function consultarDadosRedeInova() {
  try {
    const response = await fetch(`${API_URL}?tipo=metricas`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
    }

    const payload = await response.json();
    console.log("Métricas Territoriais:", payload.dados.metricas_territoriais);
    return payload.dados;
  } catch (erro) {
    console.error("Falha ao integrar com a Rede Inova Social:", erro);
  }
}

consultarDadosRedeInova();
```

---

### Exemplo 3: Python (requests)
```python
import requests

API_URL = "https://seu-dominio.redeinova.social/api/v1/integracao/rede-participa"
API_KEY = "rp_inova_sec_2026_x9k2m1"

headers = {
    "x-api-key": API_KEY,
    "Accept": "application/json"
}

params = {
    "tipo": "todos",
    "municipio": "caatiba",
    "limite": 50
}

response = requests.get(API_URL, headers=headers, params=params)

if response.status_code == 200:
    dados = response.json()
    print("Sucesso! Versão:", dados["versao_api"])
    print("Total de Produtores:", len(dados["dados"].get("produtores", [])))
    print("Total de Ofertas:", len(dados["dados"].get("ofertas", [])))
else:
    print(f"Erro {response.status_code}: {response.text}")
```

---

## 6. Estrutura da Resposta (Schema JSON)

Uma consulta com sucesso (`200 OK`) retorna a estrutura abaixo:

```json
{
  "sucesso": true,
  "origem": "Rede Inova Social - Médio Sudoeste Baiano",
  "projeto_vinculado": "Rede Participa",
  "versao_api": "v1",
  "timestamp": "2026-09-07T14:30:00.000Z",
  "parametros_aplicados": {
    "tipo": "todos",
    "municipio": "caatiba",
    "limite": 100
  },
  "dados": {
    "metricas_territoriais": {
      "total_municipios_monitorados": 13,
      "total_produtores_geral": 142,
      "total_ofertas_ativas_geral": 38,
      "detalhamento_por_municipio": {
        "caatiba": {
          "produtores": 18,
          "secretarias": 1,
          "ofertasAtivas": 6
        }
      }
    },
    "produtores": [
      {
        "id_publico": "efe4c746-dfc1-471b-aeae-63eccfc332f7",
        "nome_produtor": "Associação de Agricultores de Serra Pelada II",
        "propriedade": "Sítio Primavera",
        "municipio": "caatiba",
        "comunidade_distrito": "Serra Pelada II",
        "status": "ativo",
        "cadastrado_em": "2026-08-31T18:51:42.895Z"
      }
    ],
    "ofertas": [
      {
        "id_lote": "8b9a1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d",
        "produto": "Chocolate Artesanal (70% Cacau)",
        "descricao": "Chocolate agroecológico produzido sem agrotóxicos.",
        "quantidade_disponivel": 250,
        "unidade_venda": "barra",
        "preco_unitario": 15.00,
        "pedido_minimo": 5,
        "status": "ativo",
        "municipio": "caatiba",
        "publicado_em": "2026-09-01T10:15:00.000Z"
      }
    ],
    "producao": [
      {
        "id_registro": "3f2e1d0c-9b8a-7c6d-5e4f-3a2b1c0d9e8f",
        "cultura": "Cacau Cabruca",
        "unidade_manejo": "Talhão Principal",
        "area_hectares": 3.5,
        "estimativa_volume": 1200,
        "unidade_medida": "kg",
        "status_ciclo": "em_andamento",
        "inicio_ciclo": "2026-05-10",
        "previsao_colheita": "2026-10-20",
        "municipio": "caatiba"
      }
    ]
  }
}
```

---

## 7. Códigos de Status HTTP

| Código | Significado | Descrição |
| :--- | :--- | :--- |
| **`200 OK`** | Sucesso | Os dados foram recuperados e retornados com sucesso. |
| **`401 Unauthorized`** | Não Autorizado | Chave de API ausente ou inválida. Verifique o cabeçalho `x-api-key`. |
| **`405 Method Not Allowed`** | Método Inválido | Foi utilizado um verbo diferente de `GET` (ex: `POST` ou `DELETE`). |
| **`500 Internal Server Error`** | Erro Interno | Falha ao consultar o banco de dados. Contate a equipe da Rede Inova. |

---

## 8. Boas Práticas e Recomendações

1. **Cache na Origem:** Recomendamos que a plataforma da Rede Participa armazene os dados em cache com intervalo de **15 a 30 minutos**, evitando requisições desnecessárias a cada visualização de página.
2. **Rotatividade de Chaves:** Em caso de renovação periódica da chave ou desligamento de membros técnicos, a coordenação da Rede Inova Social gerará uma nova chave imediatamente pelo painel administrativo.
3. **Dúvidas Técnicas:** Entre em contato direto com a equipe de desenvolvimento da Rede Inova Social.
