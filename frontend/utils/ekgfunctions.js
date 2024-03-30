// Function to detect peaks in EKG data
export function detectPeaks(data, threshold) {
    const peaks = [];
    for (let i = 1; i < data.length - 1; i++) {
        if (data[i] > threshold && data[i] > data[i - 1] && data[i] > data[i + 1]) {
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
    const maxima = Math.max(...ekgData);
    return maxima;
}

// Function to find minima in EKG data
export function findMinima(ekgData) {
    const minima = Math.min(...ekgData);
    return minima;
}


// Function to measure the slope of a specific segment
export function measureSegmentSlope(ekgData, peaks) {
    const slopes = [];

    for (let i = 0; i < peaks.length - 1; i++) {
        const peakIndex = peaks[i];
        const nextPeakIndex = peaks[i + 1];
        const peakValue = ekgData[peakIndex];
        const nextPeakValue = ekgData[nextPeakIndex];

        // Find the lowest point after the peak (ST segment)
        let lowestPoint = Number.MAX_SAFE_INTEGER;
        let lowestPointIndex = peakIndex;
        for (let j = peakIndex; j < nextPeakIndex; j++) {
            if (ekgData[j] < lowestPoint) {
                lowestPoint = ekgData[j];
                lowestPointIndex = j;
            }
        }

        // Find the midpoint of the decline after the next peak (T wave)
        let halfwayPointIndex = nextPeakIndex;
        let foundDownward = false;
        for (let k = nextPeakIndex; k < ekgData.length; k++) {
            if (foundDownward && ekgData[k] >= nextPeakValue) {
                halfwayPointIndex = (k + lowestPointIndex) / 2;
                break;
            }
            if (ekgData[k] < nextPeakValue) {
                foundDownward = true;
            }
        }

        // Calculate the slope between the two points
        const slope = (ekgData[halfwayPointIndex] - ekgData[lowestPointIndex]) / (halfwayPointIndex - lowestPointIndex);
        slopes.push(slope);
    }

    return slopes;
}


