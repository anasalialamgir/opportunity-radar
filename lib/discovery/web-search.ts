/** A search provider must be configured before broad web discovery is advertised.
 * Source adapters supply real, linked listings; this module never invents results. */
export class WebSearchDiscovery {
  static async discover(): Promise<[]> { return []; }
}
