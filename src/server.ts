import { PrismaClient } from '@prisma/client';
import * as http from 'http'

const prismaC = new PrismaClient();
http.createServer(async (req, res)=>{
    const {method, url} = req;
    if (method === 'POST') {
      try{
        let data = '';
        req.on('data', (chunk) => {
          data += chunk;
        });
        req.on('end', async () => {
            const jsonResponse = JSON.parse(data);
            const dados = await prismaC.modalidade.create({
                data: {
                    "universidade": jsonResponse["Universidade"],
                    "campus": jsonResponse["Campus"],
                    "nome_Curso": jsonResponse["Nome_Curso"],
                    "nota_Corte": jsonResponse["Nota_Corte"]
                },
             });
             res.statusCode = 201;
             res.setHeader('Content-Type', 'text/plain');
             res.setHeader('Access-Control-Allow-Origin', '*');
             res.end("Deu certo");
        });
      } catch (error) {
        console.error("Erro criar ao registro:", error);
        res.statusCode = 500;
        res.end("Erro interno no servidor");
      }
      }
      else if (method === 'GET' && url === '/list') {
        try {
            const dados = await prismaC.modalidade.findMany();
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify(dados));
        } catch (error) {
            console.error("Erro ao buscar registros:", error);
            res.statusCode = 500;
            res.end("Erro interno no servidor");
        }
      }
      else{
        res.statusCode = 404;
        res.end("Rota nao encontrada")
      }
}).listen(3333)
console.log("Servidor rodando na porta 3333")

