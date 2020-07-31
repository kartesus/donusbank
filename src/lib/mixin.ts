export function mixin(derivedCtor: any, baseCtors: any[]) {
  for (let baseCtor of baseCtors) {
    let properties = Object.getOwnPropertyNames(baseCtor.prototype)
    for (let name of properties) {
      let descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      Object.defineProperty(
        derivedCtor.prototype, name, <PropertyDescriptor & ThisType<any>>descriptor)
    }
  }
}