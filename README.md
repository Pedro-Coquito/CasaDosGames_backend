## Casa dos Games

Catálogo de jogos em React + TypeScript. O frontend consome uma API Fastify com CRUD em memória. Os jogos cadastrados existem enquanto o servidor estiver ligado e são perdidos quando ele reinicia. O login é mockado, sem banco e sem JWT.

Alunos: Matheus Soares, Pedro Cavalcanti Coquito, Yan mendonça.

## Pré-requisito

Node.js 20 ou superior.

## Instalar

Na pasta do projeto:

```bash
npm install
```

## Executar

São dois processos. Abra dois terminais na pasta do projeto.

Terminal 1, API:

```bash
npm run server
```

A API sobe em `http://localhost:3333`. `GET /health` responde `{ "status": "ok" }`.

Terminal 2, interface:

```bash
npm run dev
```

O Vite mostra o endereço local, em geral `http://localhost:5173`.

Login de demonstração: `admin@email.com` / `123456`. Também existe `usuario@email.com` / `senha123`.

## Rotas da interface

- `/login` — entrada pública
- `/` — painel com totais e um recorte dos favoritos
- `/jogos` — catálogo com busca, filtro e ordenação
- `/jogos/novo` — cadastro
- `/jogos/:id` — detalhe, favoritar, editar e excluir
- `/jogos/:id/editar` — edição
- `/favoritos` — lista local de favoritos

Favoritos ficam no `localStorage` do navegador. O restante do catálogo vem da API.

## API

| Método | Rota | Sucesso | Erro |
| --- | --- | --- | --- |
| GET | `/health` | 200 | |
| GET | `/games` | 200 | |
| GET | `/games/:id` | 200 | 400 id inválido, 404 inexistente |
| POST | `/games` | 201 | 400 corpo inválido |
| PUT | `/games/:id` | 200 | 400 inválido, 404 inexistente |
| DELETE | `/games/:id` | 204 | 400 id inválido, 404 inexistente |

Campos obrigatórios no POST e no PUT: `title` (mínimo 2 caracteres), `short_description` (mínimo 10), `genre` e `platform`. `thumbnail` e `game_url`, quando enviados, precisam ser URL `http` ou `https`. Sem imagem, a API gera uma capa.

Organização do backend:

- `backend/server.ts` sobe o Fastify, liga o logger e o CORS
- `backend/src/data/games.ts` guarda a lista em memória e valida o corpo
- `backend/src/routes/health.ts` e `backend/src/routes/games.ts` declaram as rotas

O CORS aceita o frontend em `localhost` ou `127.0.0.1`, em qualquer porta.

## Performance

O catálogo real tem poucos jogos, então filtrar a lista na tela não é gargalo. A medição usa uma amostra de 4000 itens e repete o filtro 300 vezes, que é o custo se o cálculo rodasse de novo em todo render.

O código memoriza o resultado com `useMemo` e só recalcula quando a busca, o gênero, a ordem ou a lista mudam. No catálogo, o botão "Medir filtro" repete essa comparação e escreve o tempo na tela e no console. No terminal:

```bash
npm run measure
```

Medição nesta máquina, em 09/10/2026: 300 filtros sobre 4000 jogos levaram 2003,93 ms quando o cálculo era refeito toda vez, e 4,12 ms quando o resultado era reutilizado. O catálogo real tem 12 jogos, então o filtro da tela não é o gargalo. A memorização evita refazer o trabalho se a lista crescer ou se a página renderizar de novo sem mudar a busca.
