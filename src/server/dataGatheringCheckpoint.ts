import { storage } from './storage';

interface CheckpointData {
  totalCompanies: number;
  processedCompanies: string[]; // Array of processed symbols
  successfulCompanies: string[];
  failedCompanies: string[];
  lastProcessedIndex: number;
  startTime: Date;
  lastUpdateTime: Date;
}

export class DataGatheringCheckpoint {
  private checkpoint: CheckpointData | null = null;
  private readonly checkpointKey = 'alpha_vantage_checkpoint';

  /**
   * Initialize or load existing checkpoint
   */
  async initializeCheckpoint(totalCompanies: number): Promise<CheckpointData> {
    // Try to load existing checkpoint from database or create new one
    this.checkpoint = {
      totalCompanies,
      processedCompanies: [],
      successfulCompanies: [],
      failedCompanies: [],
      lastProcessedIndex: 0,
      startTime: new Date(),
      lastUpdateTime: new Date()
    };

    return this.checkpoint;
  }

  /**
   * Update checkpoint with processed company
   */
  updateCheckpoint(symbol: string, success: boolean, currentIndex: number) {
    if (!this.checkpoint) return;

    this.checkpoint.processedCompanies.push(symbol);
    if (success) {
      this.checkpoint.successfulCompanies.push(symbol);
    } else {
      this.checkpoint.failedCompanies.push(symbol);
    }
    this.checkpoint.lastProcessedIndex = currentIndex;
    this.checkpoint.lastUpdateTime = new Date();

    // Log progress every 50 companies
    if (this.checkpoint.processedCompanies.length % 50 === 0) {
      console.log(`Checkpoint: ${this.checkpoint.processedCompanies.length}/${this.checkpoint.totalCompanies} processed`);
      console.log(`Success rate: ${Math.round(this.checkpoint.successfulCompanies.length / this.checkpoint.processedCompanies.length * 100)}%`);
    }
  }

  /**
   * Get current progress
   */
  getProgress() {
    if (!this.checkpoint) return null;

    return {
      total: this.checkpoint.totalCompanies,
      processed: this.checkpoint.processedCompanies.length,
      successful: this.checkpoint.successfulCompanies.length,
      failed: this.checkpoint.failedCompanies.length,
      lastIndex: this.checkpoint.lastProcessedIndex,
      startTime: this.checkpoint.startTime,
      lastUpdate: this.checkpoint.lastUpdateTime
    };
  }

  /**
   * Check if symbol was already processed
   */
  isProcessed(symbol: string): boolean {
    return this.checkpoint?.processedCompanies.includes(symbol) || false;
  }

  /**
   * Get starting index for resuming
   */
  getResumeIndex(): number {
    return this.checkpoint?.lastProcessedIndex || 0;
  }

  /**
   * Save final results summary
   */
  async saveFinalResults() {
    if (!this.checkpoint) return;

    const summary = {
      totalCompanies: this.checkpoint.totalCompanies,
      processedCount: this.checkpoint.processedCompanies.length,
      successfulCount: this.checkpoint.successfulCompanies.length,
      failedCount: this.checkpoint.failedCompanies.length,
      successRate: Math.round(this.checkpoint.successfulCompanies.length / this.checkpoint.processedCompanies.length * 100),
      startTime: this.checkpoint.startTime,
      endTime: new Date(),
      duration: new Date().getTime() - this.checkpoint.startTime.getTime()
    };

    console.log('Final Data Gathering Results:', summary);
    return summary;
  }
}

export const dataGatheringCheckpoint = new DataGatheringCheckpoint();