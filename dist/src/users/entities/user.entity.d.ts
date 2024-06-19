export declare class UserEntity {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone_number?: string;
    created_at: Date;
    updated_at: Date;
    constructor(partial: Partial<UserEntity>);
}
