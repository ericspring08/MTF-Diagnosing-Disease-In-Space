// Function to detect peaks in EKG data
export function detectPeaks(ekgData, threshold) {
    const peaks = [];
    for (let i = 1; i < ekgData.length - 1; i++) {
        if (ekgData[i] > threshold && ekgData[i] > ekgData[i - 1] && ekgData[i] > ekgData[i + 1]) {
            peaks.push(i);
        }
    }
    return peaks;
}

// Function to calculate RR intervals from peaks
export function calculateRRIntervals(peaks, samplingRate) {
    const rrIntervals = [];
    for (let i = 1; i < peaks.length; i++) {
        const rrInterval = (peaks[i] - peaks[i - 1]) / samplingRate; // Convert indices to time
        rrIntervals.push(rrInterval);
    }
    return rrIntervals;
}

// Function to find maxima in EKG data
export function findMaxima(ekgData) {
    const maxima = [];
    for (let i = 1; i < ekgData.length - 1; i++) {
        if (ekgData[i] > ekgData[i - 1] && ekgData[i] > ekgData[i + 1]) {
            maxima.push(i);
        }
    }
    return maxima;
}

// Function to find minima in EKG data
export function findMinima(ekgData) {
    const minima = [];
    for (let i = 1; i < ekgData.length - 1; i++) {
        if (ekgData[i] < ekgData[i - 1] && ekgData[i] < ekgData[i + 1]) {
            minima.push(i);
        }
    }
    return minima;
}

// Function to measure the length of a specific segment
export function measureSegmentLength(ekgData, start, end, samplingRate) {
    const segmentLength = (end - start) / samplingRate; // Convert indices to time
    return segmentLength;
}
