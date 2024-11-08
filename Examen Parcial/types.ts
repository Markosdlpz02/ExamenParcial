import{ObjectId, OptionalId} from "mongodb"

export type PersonModel = OptionalId<{

    nombre:string,
    email:string,
    telefono:string,
    amigos:ObjectId[]
}>

export type AmigoModel =OptionalId<{

    nombre:string,
    email:string,
    telefono:string,
}>

export type Person = {

    id:string,
    nombre:string,
    email:string,
    telefono:string,
    amigos:Amigo[]
}

export type Amigo={
    id:string,
    nombre:string,
    email:string,
    telefono:string
}

    