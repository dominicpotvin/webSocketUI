
  // src/app/models/step-motor.model.ts
export interface StepMotor {
  id: number;
  acceleration: number;
  rpm: number;
  deceleration: number;
  angle: number;
  torque: number;
  steps: number;
  current: number;
  direction: string;
  voltage: number;
  speed: number;
  power: number;
}