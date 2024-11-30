const express = require("express")
const cors = require("cors")
const app = express()
const knex = require('knex')

app.use(cors())
app.use(express.json())

const db = knex({
    client: 'pg',
    connection: {
        host: 'db-cs196.cri2ageo4j6r.us-east-1.rds.amazonaws.com',                   // Database host
        user: 'postgres',                   // Your PostgreSQL username
        password: 'Gwapojosef#1',               // Your PostgreSQL password
        database: 'DEMO',               // Database name
        // SSL configuration
        ssl: { rejectUnauthorized: false }  //SSL configuration llows connections even with untrusted certificates
    },
}); 

const Note = {
  create: async (noteData) => {
    try {
      const result = await db('note').insert(noteData).returning('note_id');
      return result[0];
    } catch (error) {
      console.error('Error inserting note:', error);
      throw error;
    }
  },
  
  findAll: async () => {
    try {
      return await db('note').select('*').orderBy('note_id', "desc");
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  update: async (noteId, title, description) => {
    try{
      return result = await db('note')
        .where('note_id', '=', noteId)  
        .update({
          note_title: title,             
          note_description: description,    
        });
    } catch(error){
      console.error('Error updating note:', error);
      throw error;
    }
  },

  delete: async (noteId) =>{
    try{
      return result = await db('note')
      .where('note_id', '=', noteId)
      .del();
    }catch(error){
      console.error('Error deleting note:', error)
      throw error;
    }
  }
};

app.get('/note', async (req,res) => {
    try{
        const notes = await Note.findAll();
        return res.json(notes)
    }catch(err){
        return res.status(500).json(err)
    }
})

app.post('/note', async(req,res) =>{
    const {title, description} = req.body

    const newNote = {
        note_title: title,
        note_description: description,
    }

    try{
        const noteId = await Note.create(newNote)
        console.log(`Note created with ID: ${noteId}`)
        return res.status(201).json(noteId);
    } catch(err){
        return res.status(500).json({ error: 'Failed to create note' });
    }
    
})

app.put('/note/:id', async(req, res) => {
    const {id} = req.params
    const {title, description} = req.body

    try {
      const noteUpdate = await Note.update(id, title, description)
      console.log(`Note updated with ID: ${note_id}`)
      return res.status(500).json(noteUpdate)

    } catch (error){
      return res.status(500).json({ error: 'Failed to update note' });
    }
})

app.delete('/note/:id', async(req, res) =>{
  const {id} = req.params

  try{
    const noteDelete = await Note.delete(id)
    console.log(`Note deleted with ID: ${id}`)
    return res.status(500).json(noteDelete)
  }catch(error){
    return res.status(500).json({ error: 'Failed to delete note' });
  }
})

const port = process.env.PORT || 4000

app.listen(port, () => console.log(`Server on localhost: ${port}`))




