/**
 * Mock Data Generator for Test Automation
 * Generates realistic user data for testing signup flows
 * These users will be visible in the database for verification
 */

export class MockDataGenerator {
  private static usedEmails = new Set<string>();
  private static counter = 0;

  /**
   * Generate a unique realistic user for signup testing
   */
  static generateUniqueUser() {
    const timestamp = Date.now();
    const uniqueId = ++this.counter;

    const firstNames = [
      "John",
      "Sarah",
      "Michael",
      "Emma",
      "David",
      "Olivia",
      "James",
      "Sophia",
      "Robert",
      "Isabella",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
    ];

    const firstName =
      firstNames[Math.floor(Math.random() * firstNames.length)] || "Test";
    const lastName =
      lastNames[Math.floor(Math.random() * lastNames.length)] || "User";

    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}.${uniqueId}@yekzen-test.com`;
    this.usedEmails.add(email);

    return {
      name: `${firstName} ${lastName}`,
      email: email,
      password: "Test123!@#",
      phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    };
  }

  /**
   * Generate a user for duplicate email testing
   * Returns the same email twice
   */
  static generateDuplicateEmailScenario() {
    const user = this.generateUniqueUser();
    return {
      firstUser: user,
      duplicateUser: {
        name: "Different Name",
        email: user.email, // Same email
        password: "DifferentPass123!",
        phone: "+1-555-9999",
      },
    };
  }

  /**
   * Generate user with weak password
   */
  static generateWeakPasswordUser() {
    const user = this.generateUniqueUser();
    return {
      ...user,
      password: "abc", // Only 3 characters
    };
  }

  /**
   * Generate user with mismatched passwords
   */
  static generateMismatchedPasswordUser() {
    const user = this.generateUniqueUser();
    return {
      ...user,
      password: "Test123!@#",
      confirmPassword: "Different456!@#",
    };
  }

  /**
   * Generate user with invalid email format
   */
  static generateInvalidEmailUser() {
    const user = this.generateUniqueUser();
    return {
      ...user,
      email: "invalid-email-format", // No @ or domain
    };
  }

  /**
   * Generate user for successful registration (can verify in DB)
   */
  static generateValidUser(testName?: string) {
    const user = this.generateUniqueUser();
    if (testName) {
      // Add test name to help identify in database
      user.name = `${user.name} [${testName}]`;
    }
    return user;
  }

  /**
   * Reset the used emails set (for test isolation)
   */
  static reset() {
    this.usedEmails.clear();
    this.counter = 0;
  }
}
