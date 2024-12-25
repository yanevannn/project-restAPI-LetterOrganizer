const express = require('express');
const dotenv = require('dotenv');
const {PrismaClient} = require('@prisma/client');

const app = express();
const prisma  = new PrismaClient();

dotenv.config();
app.use(express.json());

app.get("/letter-categories", async (req,res)=>{
    const letterCategories = await prisma.letter_Categories.findMany();
    res.send(letterCategories);
});

app.get("/letter-categories/:category_name", async (req,res)=>{
    const categoryName = req.params.category_name;

    const letterCategory = await prisma.letter_Categories.findFirst({
        where: {
            "category_name" : categoryName
        }
    });

    if(!letterCategory){
        return res.status(400).send(`Category ${categoryName} Not Found`)
    }
    res.send(letterCategory);
});

app.post("/letter-categories", async (req, res) => {
    try {
        const newCategories = req.body;
        const newCategory = await prisma.letter_Categories.create({
            data: {
                category_name : newCategories.category_name
            }
        });
        res.status(201).send(newCategory);
    } catch (error) {
        res.status(500).send({error: "An error occurred while creating the letter category."});
    }
});

app.put("/letter-categories/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const updatedData = req.body;

        const updatedCategory = await prisma.letter_Categories.update({
            where: {
                id: id
            },
            data: {
                category_name: updatedData.category_name,
            },
        });

        res.status(200).send(updatedCategory);
    } catch (error) {
        res.status(500).send({error: "An error occurred while updating the letter category."});
    }
});

app.delete("/letter-categories/:id", async (req , res )=> {
    try {
        const {id} = req.params;
        const DeletedCategory = await prisma.letter_Categories.delete({
            where: {
                id: id
            }
        })
        res.status(204).send({ message: "Categories Deleted Successfully"});
    } catch (error) {
        res.status(500).send({error: "An error occurred while updating the letter category."});
    }
});

app.listen(process.env.PORT, ()=>{
    console.log(`server berjalan di http://localhost:${process.env.PORT}`)
});