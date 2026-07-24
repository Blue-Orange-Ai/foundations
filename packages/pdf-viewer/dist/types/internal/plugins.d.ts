/**
 * Builds the @embedpdf plugin registration list from the resolved viewer
 * configuration. Plugins are only registered when the corresponding feature is
 * enabled, keeping the runtime lean.
 */
import { type PluginBatchRegistrations } from '@embedpdf/core';
import type { ResolvedConfig } from './context';
export declare const buildPlugins: (config: ResolvedConfig) => PluginBatchRegistrations;
