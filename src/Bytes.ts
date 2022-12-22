import { Buffer } from "buffer";

export class Bytes<T extends number> {
  static fromUint8Array<T extends number>(bytes: Uint8Array): Bytes<T> {
    return new Bytes<T>(Buffer.from(bytes));
  }

  static fromString<T extends number>(bytes: string): Bytes<T> {
    if (bytes.startsWith("0x")) {
      return new Bytes<T>(Buffer.from(bytes.substring(2), "hex"));
    } else {
      return new Bytes<T>(Buffer.from(bytes, "hex"));
    }
  }

  constructor(public readonly bytes: Buffer) {}

  get zero(): boolean {
    return this.bytes.every((b) => b == 0);
  }

  equals(other: Bytes<T> | undefined): boolean {
    return other?.bytes.equals(this.bytes) ?? false;
  }

  toString(): string {
    return "0x" + this.bytes.toString("hex");
  }

  // Display bytes as `0xabcd…1234`.
  toDisplayString(left: number = 2, right: number = left): string {
    return (
      "0x" +
      this.bytes.subarray(0, left).toString("hex") +
      "…" +
      this.bytes.subarray(-right).toString("hex")
    );
  }
}

export class Address extends Bytes<20> {
  static zero = new Address(Buffer.alloc(20));
}

export class Hash extends Bytes<32> {}
