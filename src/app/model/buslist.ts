
export interface Buslist {    
    busId:number,
    busName:string,
    popularity:any,
    busNumber:string,
    operatorId:number,
    operatorName:string,
    sittingType:string
    busType:string
    busTypeName:string
    totalSeats:number,
    seaters:number,
    sleepers:number,
    startingFromPrice:number,
    departureTime:string,
    arrivalTime:string,
    totalJourneyTime:string,
    amenityName:any[],
    amenityIcon:any[],
    safetyIconName:any[],
    safetyIcon:any[],
    busPhotos:any[],
    seaterPrice:any,
    sleeperPrice:any
}
