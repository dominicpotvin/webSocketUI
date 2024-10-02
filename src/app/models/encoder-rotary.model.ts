// src/app/models/encoder-rotary.model.ts
export interface EncoderRotary {
    id: string;
    rpm: number;
    angle: number;
    steps: number;
    direction: number;
    speed: number;
    acceleration: number;
    deceleration: number;
    torque: number;
    current: number;
    voltage: number;
    power: number;
  }
  