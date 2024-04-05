import * as http from 'http'
import { PrismaClient } from "@prisma/client";

const prismaC = new PrismaClient();
http.createServer((requisicao, resposta)=>{
    if (requisicao.method === 'POST') {
        let data = '';
        requisicao.on('data', (chunk) => {
          data += chunk;
        });
        requisicao.on('end', async () => {
            const jsonResponse = JSON.parse(data);
            const dados = await prismaC.modalidade.create({
                data: {
                    "universidade": jsonResponse["Universidade"],
                    "campus": jsonResponse["Campus"],
                    "nome_Curso": jsonResponse["Nome_Curso"],
                    "nota_Corte": jsonResponse["Nota_Corte"]
                },
             });
             resposta.end("Deu certo")
        });
      }
}).listen(8080)
console.log("Servidor rodando na porta 8080")
