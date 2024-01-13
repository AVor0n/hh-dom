import { getRandomColor } from './utils.js';

const ACTIVE_BLOCK_SIZE = 100;
let activeBlock = null;

const source = document.querySelector('.source');
const targetGrid = document.querySelector('.target-grid');
const targetFree = document.querySelector('.target-free');

const createBlock = position => {
    const block = document.createElement('div');
    block.style.backgroundColor = getRandomColor();
    block.style.position = 'absolute';
    block.style.top = `${position.y - ACTIVE_BLOCK_SIZE / 2}px`;
    block.style.left = `${position.x - ACTIVE_BLOCK_SIZE / 2}px`;
    block.style.width = `${ACTIVE_BLOCK_SIZE}px`;
    block.style.height = `${ACTIVE_BLOCK_SIZE}px`;
    return block;
};

const onPointerMove = event => {
    if (!activeBlock) return;

    activeBlock.style.top = `${event.y - ACTIVE_BLOCK_SIZE / 2}px`;
    activeBlock.style.left = `${event.x - ACTIVE_BLOCK_SIZE / 2}px`;
};

const onDrop = event => {
    activeBlock.style.display = 'none';
    const dropTarget = document.elementFromPoint(event.x, event.y)?.closest('.target');
    activeBlock.style.display = 'block';

    if (!dropTarget?.classList.contains('target')) {
        activeBlock.remove();
    } else if (dropTarget?.classList.contains('target-grid')) {
        activeBlock.style.position = '';
        activeBlock.style.top = '';
        activeBlock.style.left = '';
        activeBlock.style.cursor = 'initial';
        targetGrid?.append(activeBlock);
    } else if (dropTarget?.classList.contains('target-free')) {
        const { top, left } = dropTarget.getBoundingClientRect();
        activeBlock.style.top = `${event.y - ACTIVE_BLOCK_SIZE / 2 - top}px`;
        activeBlock.style.left = `${event.x - ACTIVE_BLOCK_SIZE / 2 - left}px`;
        activeBlock.style.cursor = 'initial';
        targetFree?.append(activeBlock);
    }

    activeBlock = null;
    document.removeEventListener('pointermove', onPointerMove);
};

const onPointerClick = event => {
    activeBlock = createBlock({ x: event.x, y: event.y });
    activeBlock.style.cursor = 'grabbing';
    document.body.append(activeBlock);

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onDrop, { once: true });
};

source.addEventListener('pointerdown', onPointerClick);
