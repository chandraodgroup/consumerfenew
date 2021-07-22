export interface SeatsLayout {
  lowerBerth_totalColumns:number,
  lowerBerth_totalRows:number,
  lower_berth:Berth[],
  upperBerth_totalColumns:number,
  upperBerth_totalRows:number,
  upper_berth:Berth[],
}

export interface Berth { 
  id:number, 
  berthType: number,
  bus_seat_layout_id: number,
  bus_seats: BusSeats,
  colNumber: number,
  rowNumber: number,
  seatText: any,
  seat_class_id:number
  }


  export interface BusSeats{    
    id: number,
    bookStatus: number,
    bus_id:number,
    category: any,
    created_at: any,
    duration: any,
    new_fare: any,
    seats_id: number,
    status:number,
    ticket_price_id:number
  }

  