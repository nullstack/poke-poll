import Nullstack from 'nullstack';
import {readFileSync} from 'fs';
import {Remarkable} from 'remarkable';

class About extends Nullstack {

  // https://nullstack.app/application-startup#dependency-startup-pattern
  static async start(context) {
    const text = readFileSync('README.md', 'utf-8');
    const md = new Remarkable();
    md.use((md) => {
      const originalRender = md.renderer.rules.link_open;
      md.renderer.rules.link_open = function() {
        let result = originalRender.apply(null, arguments);
        const regexp = /href="([^"]*)"/;
        const href = regexp.exec(result)[1];
        if(!href.startsWith('/')) {
          result = result.replace('>', ' target="_blank" rel="noopener">');
        }
        return result;
      };
    });
    context.readme = md.render(text);
  }

  // https://nullstack.app/context-page
  // https://nullstack.app/full-stack-lifecycle#prepare
  prepare({project, page}) {
    page.title = `What is ${project.name}?`;
  }

  // https://nullstack.app/context
  // https://nullstack.app/server-functions
  static async getReadme({readme}) {
    return readme;
  }

  // https://nullstack.app/context
  // https://nullstack.app/full-stack-lifecycle#initiate
  async initiate(context) {
    if(!context.readme) {
      context.readme = await this.getReadme();
    }
  }
  
  // https://nullstack.app/renderable-components#inner-html
  render({readme}) {
    return (
      <article html={readme || ''} />
    )
  }

}

export default About;