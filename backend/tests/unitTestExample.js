// Simple Unit Test Example for Project Logic
const assert = require('assert');

// Mocking a project object for testing
const mockProject = {
    name: 'Test Project',
    status: 'Active',
    owner: 'user123'
};

function validateProject(project) {
    if (!project.name) return false;
    if (!['Active', 'Completed'].includes(project.status)) return false;
    return true;
}

// Test Suite
console.log('Running Project Validation Tests...');

try {
    // Test 1: Valid project
    assert.strictEqual(validateProject(mockProject), true, 'Should validate a correct project');
    console.log('✅ Test 1 Passed: Valid project recognized');

    // Test 2: Invalid status
    const invalidProject = { ...mockProject, status: 'Invalid' };
    assert.strictEqual(validateProject(invalidProject), false, 'Should fail for invalid status');
    console.log('✅ Test 2 Passed: Invalid status rejected');

    // Test 3: Missing name
    const noNameProject = { ...mockProject, name: '' };
    assert.strictEqual(validateProject(noNameProject), false, 'Should fail for missing name');
    console.log('✅ Test 3 Passed: Missing name rejected');

    console.log('\nAll projects unit tests passed! (Requirement 6)');
} catch (error) {
    console.error('❌ Test Failed:', error.message);
    process.exit(1);
}
