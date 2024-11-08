import { Collection } from "mongodb";
import {AmigoModel, Person, PersonModel } from "./types.ts";

export const fromModelToPerson = async (personDB:PersonModel, AmigosCollection:Collection<AmigoModel>):Promise<Person> => {

    const personas = await AmigosCollection.find({_id:{$in:personDB.amigos}}).toArray();

    return {
        id:personDB._id!.toString(),
        nombre:personDB.nombre,
        email:personDB.email,
        telefono:personDB.email,
        amigos: personas.map((p)=>fromModeltoAmigos(p))
    }
}

export const fromModeltoAmigos = (AmigoDB:AmigoModel) =>{

    return{
        id:AmigoDB._id!.toString(),
        nombre:AmigoDB.nombre,
        email:AmigoDB.email,
        telefono:AmigoDB.telefono,
    }
}
