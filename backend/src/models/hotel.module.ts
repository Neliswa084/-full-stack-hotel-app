export interface Hotel {
    id: number;
    name: string,
    description: string ,
    address: string,
    city:string,
    latitude: string,
    longitude: string,
    star_rating: number,
    check_in_time: string,
    check_out_time: string,
    cancellation_policy: string,
    children_policy: string,
    pet_policy: string,
    smoking_policy: string,
    is_visible: boolean,
    created_at: Date;
    updated_at: Date;

}

export type NewHotel = Omit<Hotel , 'id' | ' created_at' | ' updated_at'>