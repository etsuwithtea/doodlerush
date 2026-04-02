export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Entity extends Rect {
  vx: number;
  vy: number;
  isGrounded: boolean;
  jumpCount: number;
}

export const GRAVITY = 0.5;
export const JUMP_FORCE = -10;
export const MOVE_SPEED = 5;

export function checkCollision(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function updatePhysics(player: Entity, platforms: Rect[]) {
  // Apply gravity
  player.vy += GRAVITY;
  
  // Horizontal movement
  player.x += player.vx;
  for (const platform of platforms) {
    if (checkCollision(player, platform)) {
      if (player.vx > 0) {
        player.x = platform.x - player.width;
      } else if (player.vx < 0) {
        player.x = platform.x + platform.width;
      }
      player.vx = 0;
    }
  }

  // Vertical movement
  player.y += player.vy;
  player.isGrounded = false;
  for (const platform of platforms) {
    if (checkCollision(player, platform)) {
      if (player.vy > 0) {
        player.y = platform.y - player.height;
        player.isGrounded = true;
        player.vy = 0;
      } else if (player.vy < 0) {
        player.y = platform.y + platform.height;
        player.vy = 0;
      }
    }
  }
}
