// Enum for Item Types
export enum ItemType {
    Resistor = "Resistor",
    Potentiometer = "Potentiometer",
    Capacitor = "Capacitor",
    Inductor = "Inductor",
    Diode = "Diode",
    ZenerDiode = "ZenerDiode",
    Transistor = "Transistor",
    LED = "LED",
    Switch = "Switch",
    Transformer = "Transformer",
    Relay = "Relay",
    CrystalOscillator = "CrystalOscillator",
    Photodiode = "Photodiode",
    Phototransistor = "Phototransistor",
    Speaker = "Speaker",
    Microphone = "Microphone",
    Fuse = "Fuse",
    Motor = "Motor"
}

// Interfaces for characteristics
export interface ResistorCharacteristics {
    resistance: number;
    resistor_type: "Through Hole" | "SMD" | "Carbon" | "Metal film" | "Ceramic";
    tolerance: string;
    power_rating: number;
}

export interface PotentiometerCharacteristics {
    resistance_range: number;
    potentiometer_type: string;
    power_rating: number;
    tolerance: string;
}

export interface CapacitorCharacteristics {
    capacitance: number;
    voltage_rating: number;
    tolerance: string;
    esr: number;
    capacitor_type: string;
}

export interface InductorCharacteristics {
    inductance: number;
    current_rating: number;
    quality_factor: number;
    core_material: string;
}

export interface DiodeCharacteristics {
    forward_voltage: number;
    reverse_breakdown_voltage: number;
    current_rating: number;
    type: string;
}

export interface ZenerDiodeCharacteristics {
    zener_voltage: number;
    current_rating: number;
    power_dissipation: number;
}

export interface TransistorCharacteristics {
    transistor_type: string;
    current_gain: number;
    vce_max: number;
    switching_speed: number;
    power_dissipation: number;
}

export interface LEDCharacteristics {
    forward_voltage: number;
    color: string;
    current_rating: number;
}

export interface SwitchCharacteristics {
    switch_type: string;
    voltage_rating: number;
    current_rating: number;
}

export interface TransformerCharacteristics {
    primary_voltage: number;
    secondary_voltage: number;
    turns_ratio: number;
    power_rating: number;
    core_type: string;
}

export interface RelayCharacteristics {
    coil_voltage: number;
    switching_time: number;
}

export interface CrystalOscillatorCharacteristics {
    frequency: number;
    tolerance: string;
    load_capacitance: number;
    package_type: string;
    temperature_range: string;
}

export interface PhotodiodeCharacteristics {
    package_type: string;
    dark_current: number;
    responsivity: number;
}

export interface PhototransistorCharacteristics {
    current_gain: number;
    spectral_response: number;
    vce: number;
    phototransistor_type: string;
}

export interface SpeakerCharacteristics {
    impedance: number;
    power_rating: number;
    frequency_response: string;
    speaker_type: string;
    sensitivity: number;
}

export interface MicrophoneCharacteristics {
    frequency_response: string;
    impedance: number;
    microphone_type: string;
    sensitivity: number;
}

export interface FuseCharacteristics {
    current_rating: number;
    voltage_rating: number;
    response_time: number;
    fuse_type: string;
}

export interface MotorCharacteristics {
    voltage_rating: number;
    current_rating: number;
    speed_rpm: number;
    motor_type: string;
    torque: number;
    power: number;
}

// Union type for all characteristics
export type Characteristics =
    | ResistorCharacteristics
    | PotentiometerCharacteristics
    | CapacitorCharacteristics
    | InductorCharacteristics
    | DiodeCharacteristics
    | ZenerDiodeCharacteristics
    | TransistorCharacteristics
    | LEDCharacteristics
    | SwitchCharacteristics
    | TransformerCharacteristics
    | RelayCharacteristics
    | CrystalOscillatorCharacteristics
    | PhotodiodeCharacteristics
    | PhototransistorCharacteristics
    | SpeakerCharacteristics
    | MicrophoneCharacteristics
    | FuseCharacteristics
    | MotorCharacteristics;

// Type mapping based on ItemType
export type ItemCharacteristicsMap = {
    [ItemType.Resistor]: ResistorCharacteristics;
    [ItemType.Potentiometer]: PotentiometerCharacteristics;
    [ItemType.Capacitor]: CapacitorCharacteristics;
    [ItemType.Inductor]: InductorCharacteristics;
    [ItemType.Diode]: DiodeCharacteristics;
    [ItemType.ZenerDiode]: ZenerDiodeCharacteristics;
    [ItemType.Transistor]: TransistorCharacteristics;
    [ItemType.LED]: LEDCharacteristics;
    [ItemType.Switch]: SwitchCharacteristics;
    [ItemType.Transformer]: TransformerCharacteristics;
    [ItemType.Relay]: RelayCharacteristics;
    [ItemType.CrystalOscillator]: CrystalOscillatorCharacteristics;
    [ItemType.Photodiode]: PhotodiodeCharacteristics;
    [ItemType.Phototransistor]: PhototransistorCharacteristics;
    [ItemType.Speaker]: SpeakerCharacteristics;
    [ItemType.Microphone]: MicrophoneCharacteristics;
    [ItemType.Fuse]: FuseCharacteristics;
    [ItemType.Motor]: MotorCharacteristics;
};

export enum Status {
    APPROVED = "Approved",
    DECLINED = "Declined",
    PENDING = "Pending"
}

// RecoveryDetail structure
export interface RecoveryLogs {
    id: string;
    condition: "working" | "fault";
    ewaste_unit_id: string; // Reference ID to a specific e-waste unit
    recovered_date: Date;
    no_of_items: number;
    status: Status;
    // failure_reasons: string[]; // Array of IDs referencing FailureReasons
}

// Main RecoveredItems interface
export interface RecoveredItems_BaseType {
    type: ItemType; // Use the enum here
    description: string;
    count: number;
    status: Status;
    characteristics: ItemCharacteristicsMap[ItemType]; // Conditional characteristics based on type
    recoveryLogs: RecoveryLogs[];
}


// Main RecoveredItems interface, extending RecoveredItems_BaseType
export interface RecoveredItems extends RecoveredItems_BaseType {
    _id: string;
    createdAt: Date,
    updatedAt: Date
}