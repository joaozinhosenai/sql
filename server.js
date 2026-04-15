/** IMPORTA OS MODULOS NECESSARIOS */
const express = require('express')
const sqlite3 = require('sqlite3').verbose()

/** CRIACAO DO MIDDLEWARE */
const app = express()
const port = 3000
app.use(express.json())

/** CONEXAO COM O BANCO DE DADOS */
const db = new sqlite3.Database("./banco.db", (err) => {
    if(err){
        console.log("Erro ao conectar com o banco de dados")
    }else{
        console.log("Conectado com sucesso ao banco de dados")
    }
}) 

/** ROTA PARA READ */
app.get("/pessoas", (require,response) => {
    db.all("SELECT * FROM pessoas", [], (err, rows) =>{
        if(err){
            return response.status(500).json(err.message)
        }
        response.json(rows)
    })
})
/** ROTA DELETE */
app.delete("/pessoas/:id", (require, response) => {
  const id = require.params.id;

  db.run("DELETE FROM pessoas WHERE id = ?", [id], function (err) {
    if (err) {
      return require.status(500).json(err.message);
    }

    response.json({ mensagem: "Pessoa removida com sucesso!" });
  });
});
/** UPDATE **/
app.put("/pessoas/:id", (require, response) => {
  const id = require.params.id;             // pega o id enviado na url
  const { nome, email } = require.body;     // pega no corpo da requisicao nome e email

  const sql = `
    UPDATE pessoas
    SET nome = ?, email = ?
    WHERE id = ?
  `;

  db.run(sql, [nome, email, id], function (err) {
    if (err) {
      return response.status(500).json(err.message);
    }

    response.json({ mensagem: "Pessoa atualizada com sucesso!" });
  });
});
/** CREATE **/
app.post("/pessoas", (require, response) => {
    const { nome,email }= require.body
    const sql = "INSERT INTO pessoas (nome, email) VALUES (?,?);"
    db.run(sql,[nome,email], function(err){
        if(err){
            return response.status(500).json(err.message)
        }
        response.status(201).json({
            id:this.lastID,
            nome,
            email
        })
    })
})

/** FAZ UM OUVINTE NO LOCALHOST NA PORTA 3000 */
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
})