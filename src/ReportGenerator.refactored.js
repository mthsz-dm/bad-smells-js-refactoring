export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  /**
   * Gera um relatório de itens baseado no tipo e no usuário.
   * - Admins veem tudo.
   * - Users comuns só veem itens com valor <= 500.
   */
  generateHeader(reportType, user) {
    let header = "";
    if (reportType === "CSV") {
      header = "ID,NOME,VALOR,USUARIO\n";
    } else if (reportType === "HTML") {
      header = `<html><body>\n<h1>Relatório</h1>\n<h2>Usuário: ${user.name}</h2>\n<table>\n<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n`;
    }
    return header;
  }

  generateFooter(reportType, total) {
    let footer = "";
    if (reportType === "CSV") {
      footer = `\nTotal,,\n${total},,\n`;
    } else if (reportType === "HTML") {
      footer = `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }
    return footer;
  }

  shouldIncludeItem(item, user) {
    return user.role === "ADMIN" || (user.role === "USER" && item.value <= 500);
  }

  getPriorityStyle(item) {
    return item.value > 1000 ? 'style="font-weight:bold;"' : "";
  }

  generateItemLine(item, reportType, user) {
    if (!this.shouldIncludeItem(item, user)) return "";

    const itemString = `${item.id},${item.name},${item.value},${user.name}\n`;
    const itemHTML = `<tr ${this.getPriorityStyle(item)}><td>${
      item.id
    }</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;

    return reportType === "CSV" ? itemString : itemHTML;
  }

  calculateTotal(items, user) {
    return items.reduce((total, item) => {
      if (this.shouldIncludeItem(item, user)) {
        total += item.value;
      }
      return total;
    }, 0);
  }

  generateReport(reportType, user, items) {
    let header = this.generateHeader(reportType, user);
    let body = "";

    for (const item of items) {
      body = this.generateItemLine(item, reportType, user);
    }

    let footer = this.generateFooter(
      reportType,
      this.calculateTotal(items, user)
    );
    return `${header}${body}${footer}`.trim();
  }
}
