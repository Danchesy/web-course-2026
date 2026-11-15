import { describe, expect, it } from 'vitest';
import {
  calculateStats,
  filterTasks,
  generateId,
  sortTasks
} from '../../task11/src/model.js';

const tasks = [
  { id: '1', text: 'Write tests', completed: false },
  { id: '2', text: 'Build app', completed: true },
  { id: '3', text: 'Review code', completed: false }
];

describe('filterTasks', () => {
  it('returns only active tasks', () => {
    expect(filterTasks(tasks, 'active').map((task) => task.id)).toEqual(['1', '3']);
  });

  it('returns only completed tasks', () => {
    expect(filterTasks(tasks, 'completed')).toEqual([tasks[1]]);
  });

  it('returns an empty list when no tasks match', () => {
    expect(filterTasks([], 'active')).toEqual([]);
  });

  it('returns all tasks for the all filter', () => {
    expect(filterTasks(tasks, 'all')).toBe(tasks);
  });
});

describe('sortTasks', () => {
  it('sorts tasks alphabetically without mutating the input', () => {
    expect(sortTasks(tasks, 'alpha').map((task) => task.text)).toEqual([
      'Build app',
      'Review code',
      'Write tests'
    ]);
    expect(tasks.map((task) => task.id)).toEqual(['1', '2', '3']);
  });

  it('puts the newest task first', () => {
    expect(sortTasks(tasks, 'newest').map((task) => task.id)).toEqual(['3', '2', '1']);
  });

  it('puts the oldest task first', () => {
    expect(sortTasks(tasks, 'oldest').map((task) => task.id)).toEqual(['1', '2', '3']);
  });

  it('preserves task order for an unknown sort type', () => {
    const result = sortTasks(tasks, 'unknown');

    expect(result).toEqual(tasks);
    expect(result).not.toBe(tasks);
  });
});

describe('calculateStats', () => {
  it('counts completed and unfinished tasks', () => {
    expect(calculateStats(tasks)).toEqual({ left: 2, done: 1 });
  });

  it('returns zero counts for an empty list', () => {
    expect(calculateStats([])).toEqual({ left: 0, done: 0 });
  });
});

describe('generateId', () => {
  it('returns a string id', () => {
    expect(generateId()).toMatch(/^\d+$/);
  });
});
