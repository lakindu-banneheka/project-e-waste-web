import { ItemType } from "@/types/recovered-items";

export const itemTypeFields: Record<ItemType, { label: string; name: string; type: string }[]> = {
    [ItemType.Resistor]: [
        { label: "Resistance (Ω)", name: "resistance", type: "number" },
        { label: "Resistor Type", name: "resistor_type", type: "text" },
        { label: "Tolerance (%)", name: "tolerance", type: "text" },
        { label: "Power Rating (W)", name: "power_rating", type: "number" },
    ],
    [ItemType.Capacitor]: [
        { label: "Capacitance (μF)", name: "capacitance", type: "number" },
        { label: "Voltage Rating (V)", name: "voltage_rating", type: "number" },
        { label: "Tolerance (%)", name: "tolerance", type: "text" },
        { label: "ESR (Ω)", name: "esr", type: "number" },
        { label: "Capacitor Type", name: "capacitor_type", type: "text" },
    ],
    [ItemType.Inductor]: [
        { label: "Inductance (mH)", name: "inductance", type: "number" },
        { label: "Current Rating (A)", name: "current_rating", type: "number" },
        { label: "Resistance (DCR Ω)", name: "resistance", type: "number" },
        { label: "Inductor Type", name: "inductor_type", type: "text" },
    ],
    [ItemType.Diode]: [
        { label: "Forward Voltage (V)", name: "forward_voltage", type: "number" },
        { label: "Reverse Voltage (V)", name: "reverse_voltage", type: "number" },
        { label: "Current Rating (A)", name: "current_rating", type: "number" },
        { label: "Diode Type", name: "diode_type", type: "text" },
    ],
    [ItemType.Transistor]: [
        { label: "Transistor Type", name: "transistor_type", type: "text" },
        { label: "Maximum Voltage (V)", name: "max_voltage", type: "number" },
        { label: "Maximum Current (A)", name: "max_current", type: "number" },
        { label: "Gain (hFE)", name: "gain", type: "number" },
    ],
    [ItemType.LED]: [
        { label: "Color", name: "color", type: "text" },
        { label: "Forward Voltage (V)", name: "forward_voltage", type: "number" },
        { label: "Current Rating (mA)", name: "current_rating", type: "number" },
        { label: "Luminous Intensity (mcd)", name: "luminous_intensity", type: "number" },
    ],
    [ItemType.Relay]: [
        { label: "Coil Voltage (V)", name: "coil_voltage", type: "number" },
        { label: "Contact Current Rating (A)", name: "contact_current_rating", type: "number" },
        { label: "Relay Type", name: "relay_type", type: "text" },
        { label: "Contact Configuration", name: "contact_configuration", type: "text" },
    ],
    [ItemType.Transformer]: [
        { label: "Primary Voltage (V)", name: "primary_voltage", type: "number" },
        { label: "Secondary Voltage (V)", name: "secondary_voltage", type: "number" },
        { label: "Power Rating (VA)", name: "power_rating", type: "number" },
        { label: "Transformer Type", name: "transformer_type", type: "text" },
    ],
    [ItemType.Switch]: [
        { label: "Switch Type", name: "switch_type", type: "text" },
        { label: "Voltage Rating (V)", name: "voltage_rating", type: "number" },
        { label: "Current Rating (A)", name: "current_rating", type: "number" },
        { label: "Number of Poles", name: "number_of_poles", type: "number" },
    ],
    [ItemType.Fuse]: [
        { label: "Current Rating (A)", name: "current_rating", type: "number" },
        { label: "Voltage Rating (V)", name: "voltage_rating", type: "number" },
        { label: "Fuse Type", name: "fuse_type", type: "text" },
        { label: "Blow Time", name: "blow_time", type: "text" },
    ],
    [ItemType.Potentiometer]: [
        { label: "Resistance (Ω)", name: "resistance", type: "number" },
        { label: "Type", name: "potentiometer_type", type: "text" },
        { label: "Power Rating (W)", name: "power_rating", type: "number" },
        { label: "Tolerance (%)", name: "tolerance", type: "text" },
    ],
    [ItemType.ZenerDiode]: [
        { label: "Zener Voltage (V)", name: "zener_voltage", type: "number" },
        { label: "Power Rating (W)", name: "power_rating", type: "number" },
        { label: "Tolerance (%)", name: "tolerance", type: "text" },
        { label: "Maximum Current (A)", name: "max_current", type: "number" },
    ],
    [ItemType.CrystalOscillator]: [
        { label: "Frequency (MHz)", name: "frequency", type: "number" },
        { label: "Load Capacitance (pF)", name: "load_capacitance", type: "number" },
        { label: "Package Type", name: "package_type", type: "text" },
        { label: "Operating Temperature (°C)", name: "operating_temperature", type: "text" },
    ],
    [ItemType.Photodiode]: [
        { label: "Wavelength (nm)", name: "wavelength", type: "number" },
        { label: "Reverse Voltage (V)", name: "reverse_voltage", type: "number" },
        { label: "Current (A)", name: "current", type: "number" },
        { label: "Photodiode Type", name: "photodiode_type", type: "text" },
    ],
    [ItemType.Phototransistor]: [
        { label: "Wavelength Range (nm)", name: "wavelength_range", type: "text" },
        { label: "Max Collector Current (mA)", name: "max_collector_current", type: "number" },
        { label: "Collector-Emitter Voltage (V)", name: "collector_emitter_voltage", type: "number" },
        { label: "Type", name: "phototransistor_type", type: "text" }, // e.g., NPN or PNP
    ],
    [ItemType.Speaker]: [
        { label: "Impedance (Ω)", name: "impedance", type: "number" },
        { label: "Power Rating (W)", name: "power_rating", type: "number" },
        { label: "Frequency Response (Hz)", name: "frequency_response", type: "text" },
        { label: "Speaker Type", name: "speaker_type", type: "text" }, // e.g., woofer, tweeter
    ],
    [ItemType.Microphone]: [
        { label: "Type", name: "microphone_type", type: "text" }, // e.g., condenser, dynamic
        { label: "Frequency Response (Hz)", name: "frequency_response", type: "text" },
        { label: "Sensitivity (dB)", name: "sensitivity", type: "number" },
        { label: "Impedance (Ω)", name: "impedance", type: "number" },
    ],
    [ItemType.Motor]: [
        { label: "Motor Type", name: "motor_type", type: "text" },
        { label: "Voltage Rating (V)", name: "voltage_rating", type: "number" },
        { label: "Current Rating (A)", name: "current_rating", type: "number" },
        { label: "Speed (RPM)", name: "speed", type: "number" },
    ],
};