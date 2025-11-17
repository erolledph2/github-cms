export interface GitHubConfig {
  username: string;
  repo: string;
  token: string;
}

export class GitHubClient {
  private config: GitHubConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      'Authorization': `token ${this.config.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseUrl}/repos/${this.config.username}/${this.config.repo}`,
        { headers: this.getHeaders() }
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getContents(path: string = '') {
    const response = await fetch(
      `${this.baseUrl}/repos/${this.config.username}/${this.config.repo}/contents/${path}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch contents: ${response.statusText}`);
    }

    return response.json();
  }

  async getFile(path: string) {
    const response = await fetch(
      `${this.baseUrl}/repos/${this.config.username}/${this.config.repo}/contents/${path}`,
      { headers: this.getHeaders() }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.content) {
      const content = Buffer.from(data.content, 'base64').toString('utf-8');
      return { ...data, decodedContent: content };
    }

    return data;
  }

  async createOrUpdateFile(path: string, content: string, message: string, sha?: string) {
    const body: any = {
      message,
      content: Buffer.from(content).toString('base64'),
    };

    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(
      `${this.baseUrl}/repos/${this.config.username}/${this.config.repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create/update file: ${response.statusText}`);
    }

    return response.json();
  }

  async deleteFile(path: string, message: string, sha: string) {
    const response = await fetch(
      `${this.baseUrl}/repos/${this.config.username}/${this.config.repo}/contents/${path}`,
      {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify({ message, sha }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }

    return response.json();
  }
}

export function getGitHubClient(): GitHubClient {
  const config: GitHubConfig = {
    username: process.env.GITHUB_USERNAME || '',
    repo: process.env.GITHUB_REPO || '',
    token: process.env.GITHUB_TOKEN || '',
  };

  return new GitHubClient(config);
}
