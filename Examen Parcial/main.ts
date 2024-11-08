import { MongoClient } from "mongodb";
import { AmigoModel, PersonModel } from "./types.ts";
import { fromModeltoAmigos, fromModelToPerson } from "./utils.ts";


const MONGO_URL = Deno.env.get("MONGO_URL");

if(!MONGO_URL){
  console.error("Error en la variable de entorno");
  Deno.exit(1);
}

const client = new MongoClient(MONGO_URL);
await client.connect();
console.info("Conectado a MongoDB");

const db = client.db("red personas");

const personCollection = db.collection<PersonModel>("personas");
const amigosCollection = db.collection<AmigoModel>("amigos")


const handler = async(req:Request):Promise<Response>=>{
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if(method==="GET"){

    if(path==="/personas"){
      const nombre = url.searchParams.get("nombre");

      if(name){
        const personasNombre = await personCollection.find({name}).toArray()

        const personas = await Promise.all(personasNombre.map((p)=>fromModelToPerson(p,amigosCollection)));

        return new Response(JSON.stringify(personas));
        
      }else{

        const personasNombre = await personCollection.find().toArray()

        const personas = await Promise.all(personasNombre.map((p)=>fromModelToPerson(p,amigosCollection)));

        return new Response(JSON.stringify(personas));

      }
    }else if(path==="/persona"){
      const email = url.searchParams.get("email");

      if(!email){
        return new Response("Bad request", {status:400});
      }

      const personasEmail = await personCollection.find({email}).toArray();

      if(!personasEmail){
        return new Response("Persona no encontrada", {status:404})
      }

      const personas = await Promise.all(personasEmail.map((p)=>fromModelToPerson(p,amigosCollection)));

      return new Response(JSON.stringify(personas));
    }

  }else if(method==="POST"){

    if(path==="/personas"){
      const persona = await req.json();

      if(!persona.nombre ||!persona.email ||!persona.telefono){
        return new Response("Bad request", {status:404});
      }

      const {insertedId} = await personCollection.insertOne({
        nombre:persona.nombre,
        email:persona.email,
        telefono:persona.telefono,
        amigos:persona.amigos
      }) 

      return new Response(JSON.stringify({
        nombre:persona.nombre,
        email:persona.email,
        telefono:persona.telefono,
        amigos:persona.amigos,
        id:insertedId
      }))
    }

  }else if(method === "PUT"){

    if(path==="/persona"){
      const persona = await req.json()

      const {modifiedCount} = await personCollection.updateOne(
        {email:persona.email},
        {$set:{nombre:persona.nombre, telefono:persona.telefono, amigos:persona.amigos}}
      )

      if(modifiedCount==0){
        return new Response("Usuario no encontrado", {status:404});
      }
      return new Response("OK", {status:200});
    }

  }else if(method==="DELETE"){

  }
  return new Response("Endpoint not found");
}
