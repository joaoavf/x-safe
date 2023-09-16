describe('mathUtils', () => {
    describe('add', () => {
        it('should return the sum of two numbers', () => {
        // Arrange
        const a = 2;
        const b = 3;

        // Act
        const result = a + b;

        // Assert
        expect(result).toBe(5);
        });

        it('should return a negative number when summing a positive and a negative', () => {
        // Arrange
        const a = -2;
        const b = 1;

        // Act
        const result = a + b;

        // Assert
        expect(result).toBe(-1);
        });
    });
});