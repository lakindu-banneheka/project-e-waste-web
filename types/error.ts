// Custom error classes
export class EmailInUseError extends Error {
    constructor(message = "Email is already in use") {
        super(message);
        this.name = "EmailInUseError";
    }
}

// export class DatabaseError extends Error {
//     constructor(message = "Database connection failed") {
//         super(message);
//         this.name = "DatabaseError";
//     }
// }

export class DatabaseError extends Error {
    constructor(message = "Failed to retrieve admin data") {
        super(message);
        this.name = "DatabaseError";
    }
}