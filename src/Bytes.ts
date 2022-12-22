import { Buffer } from "buffer";

export class Bytes<T extends number> {
  readonly bytes: Buffer;

  constructor(bytes: Uint8Array | Buffer | string | Bytes<T>) {
    if (bytes instanceof Uint8Array) {
      this.bytes = Buffer.from(bytes);
    } else if (bytes instanceof Buffer) {
      this.bytes = Buffer.alloc(bytes.length);
      bytes.copy(this.bytes);
    } else if (typeof bytes == "string") {
      if (bytes.startsWith("0x")) {
        this.bytes = Buffer.from(bytes.substring(2), "hex");
      } else {
        this.bytes = Buffer.from(bytes, "hex");
      }
    } else if (bytes instanceof Bytes<T>) {
      this.bytes = Buffer.alloc(bytes.bytes.length);
      bytes.bytes.copy(this.bytes);
    } else {
      throw new Error("Invalid bytes");
    }
  }

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
