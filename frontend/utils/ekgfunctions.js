import DSP from 'dspjs';

// Function to detect peaks in EKG data
export const detectPeaks(ekgData, threshold) {
    const peaks = DSP.findPeaks(ekgData, threshold);
    return peaks;
}

// Function to calculate RR intervals from peaks
export const calculateRRIntervals(peaks, samplingRate) {
    const rrIntervals = [];
    for (let i = 1; i < peaks.length; i++) {
        const rrInterval = (peaks[i] - peaks[i - 1]) / samplingRate; // Convert indices to time
        rrIntervals.push(rrInterval);
    }
    return rrIntervals;
}

// Function to find maxima in EKG data
export const findMaxima(ekgData) {
    const maxima = DSP.findMaxima(ekgData);
    return maxima;
}

// Function to find minima in EKG data
export const findMinima(ekgData) {
    const minima = DSP.findMinima(ekgData);
    return minima;
}

// Function to measure the length of a specific segment
export const measureSegmentLength(ekgData, start, end, samplingRate) {
    const segmentLength = (end - start) / samplingRate; // Convert indices to time
    return segmentLength;
}


