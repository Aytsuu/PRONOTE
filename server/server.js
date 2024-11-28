const express = require("express")
const cors = require("cors")
const app = express()
const knex = require('knex')

app.use(cors())
app.use(express.json())

const db = knex({
    client: 'pg',
    connection: {
        host: '',
        user: '',
        password: '',
        database: '',
        ssl: { rejectUnauthorized: false } 
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
      return await db('note').select('*');
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },
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

const port = process.env.PORT || 4000

app.listen(port, () => console.log(`Server on localhost: ${port}`))




