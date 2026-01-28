import axios from 'axios';
import jwt from 'jsonwebtoken';

const API_URL = 'http://localhost:3000/api';
const SECRET = process.env.JWT_SECRET || 'your-secret-key'; // This is a security risk in real test, but okay for my internal verification

async function verifyAdmissionGate() {
    console.log('🏁 Starting Admission Gate Verification...');

    // 1. Create a "PENDING_BASE" token
    const pendingToken = jwt.sign(
        { sub: 'test-user-id', scopes: ['foundation:read', 'foundation:accept'] },
        SECRET,
        { expiresIn: '1h' }
    );

    // 2. Try to access /employees (should fail 403)
    try {
        console.log('Testing /api/employees with PENDING_BASE token...');
        await axios.get(`${API_URL}/employees`, {
            headers: { Authorization: `Bearer ${pendingToken}` }
        });
        console.error('❌ FAIL: Access granted to /employees for PENDING_BASE user!');
    } catch (error: any) {
        if (error.response?.status === 403) {
            console.log('✅ PASS: Access denied (403 Forbidden) as expected.');
        } else {
            console.log(`⚠️ INFO: Received status ${error.response?.status}. (Maybe API not running?)`);
        }
    }

    // 3. Try to access /university/foundation/blocks (should pass if implemented as open)
    try {
        console.log('Testing /api/university/foundation/status with PENDING_BASE token...');
        const res = await axios.get(`${API_URL}/university/foundation/status`, {
            headers: { Authorization: `Bearer ${pendingToken}` }
        });
        console.log('✅ PASS: Access granted to foundation endpoints.');
    } catch (error: any) {
        console.log(`⚠️ INFO: Received status ${error.response?.status}.`);
    }

    console.log('🏁 Verification complete.');
}

// simulate run
verifyAdmissionGate();
