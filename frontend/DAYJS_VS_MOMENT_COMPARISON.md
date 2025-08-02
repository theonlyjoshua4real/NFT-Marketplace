# Day.js vs Moment.js Comparison

## 📊 **Quick Comparison**

| Feature | Moment.js | Day.js |
|---------|-----------|--------|
| **Bundle Size** | ~232KB | ~2KB |
| **Status** | Maintenance mode | Actively maintained |
| **Performance** | Slower (mutable) | Faster (immutable) |
| **Tree-shaking** | Limited | Excellent |
| **API** | Complex | Simple, familiar |

## 🔄 **Migration Guide**

### **Installation**
```bash
# Remove moment.js
npm uninstall moment

# Install dayjs
npm install dayjs
```

### **Basic Usage Comparison**

#### **Formatting Dates**
```javascript
// Moment.js (old)
const moment = require('moment');
const date = moment().format('YYYY-MM-DD HH:mm:ss');

// Day.js (new)
const dayjs = require('dayjs');
const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
```

#### **Parsing Dates**
```javascript
// Moment.js
const date = moment('2024-01-15').format('MMMM Do YYYY');

// Day.js
const date = dayjs('2024-01-15').format('MMMM Do YYYY');
```

#### **Date Manipulation**
```javascript
// Moment.js
const tomorrow = moment().add(1, 'day');
const lastWeek = moment().subtract(1, 'week');

// Day.js
const tomorrow = dayjs().add(1, 'day');
const lastWeek = dayjs().subtract(1, 'week');
```

#### **Date Comparison**
```javascript
// Moment.js
const isBefore = moment('2024-01-01').isBefore('2024-01-15');
const isAfter = moment('2024-01-15').isAfter('2024-01-01');

// Day.js
const isBefore = dayjs('2024-01-01').isBefore('2024-01-15');
const isAfter = dayjs('2024-01-15').isAfter('2024-01-01');
```

## 🚀 **Day.js Plugins (Optional)**

Day.js uses a plugin system for additional features:

```javascript
// Import plugins as needed
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const relativeTime = require('dayjs/plugin/relativeTime');

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
```

## 📅 **NFT Marketplace Examples**

### **Countdown Timer**
```javascript
// Using Day.js
const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');

dayjs.extend(duration);

function getCountdown(releaseDate) {
  const now = dayjs();
  const release = dayjs(releaseDate);
  const diff = release.diff(now);
  
  if (diff <= 0) return null;
  
  const duration = dayjs.duration(diff);
  return {
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds()
  };
}
```

### **Format Transaction Timestamps**
```javascript
// Using Day.js
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

function formatTransactionTime(timestamp) {
  return dayjs(timestamp).fromNow(); // "2 hours ago"
}
```

### **Date Validation**
```javascript
// Using Day.js
const dayjs = require('dayjs');

function isValidDate(dateString) {
  return dayjs(dateString).isValid();
}

function isFutureDate(dateString) {
  return dayjs(dateString).isAfter(dayjs());
}
```

## 📦 **Updated Backend Dependencies**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "mongoose": "^8.0.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "web3": "^4.3.0",
    "joi": "^17.11.0",
    "dayjs": "^1.11.10"
  }
}
```

## 🎯 **Why Day.js is Better**

### **1. Bundle Size**
- **Moment.js**: 232KB
- **Day.js**: 2KB
- **Savings**: 98% smaller!

### **2. Performance**
```javascript
// Moment.js (mutable - changes original object)
const date = moment('2024-01-01');
date.add(1, 'day'); // Original date is modified

// Day.js (immutable - returns new object)
const date = dayjs('2024-01-01');
const tomorrow = date.add(1, 'day'); // Original unchanged
```

### **3. Tree-shaking**
```javascript
// Day.js - only import what you need
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
```

### **4. Modern JavaScript**
```javascript
// Day.js works great with ES6+
const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

// Easy to use with async/await
const getTimeAgo = async (timestamp) => {
  return dayjs(timestamp).fromNow();
};
```

## 🔧 **Migration Checklist**

- [ ] **Uninstall moment.js**: `npm uninstall moment`
- [ ] **Install dayjs**: `npm install dayjs`
- [ ] **Update imports**: `const dayjs = require('dayjs')`
- [ ] **Test date formatting**: Ensure all formats work
- [ ] **Update any custom date utilities**
- [ ] **Test countdown timers and relative time**
- [ ] **Update documentation**

## 💡 **Pro Tips**

1. **Import only what you need** - Day.js plugins are optional
2. **Use immutable operations** - Always assign the result
3. **Leverage tree-shaking** - Smaller bundle sizes
4. **Test thoroughly** - Some edge cases might differ
5. **Update gradually** - You can migrate file by file

The migration is straightforward since Day.js has a very similar API to Moment.js, but with much better performance and smaller bundle size! 